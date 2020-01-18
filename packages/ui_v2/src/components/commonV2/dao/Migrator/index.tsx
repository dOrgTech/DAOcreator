import React, { FC, useState, Fragment } from "react";
import {
  DAOMigrationParams,
  DAOMigrationResult,
  getWeb3,
  DAOMigrationCallbacks,
  migrateDAO
} from "@dorgtech/daocreator-lib";
import { MDBContainer, MDBRow, MDBBtn, MDBBtnGroup } from "mdbreact";
import {
  LogUserApproval,
  LogInfo,
  LogError,
  LogTransactionResult,
  LogMigrationAborted,
  AnyLogLine,
  LogType
} from "./LogLineTypes";
import CreateOrganisation from "./CreateOrganisation";
import ConfigureOrganisation from "./ConfigureOrganisation";

interface IProps {
  dao: DAOMigrationParams;
  onComplete: (result: DAOMigrationResult) => void;
  onStart: () => void;
  onAbort: (error: Error) => void;
  onStop: () => void;
}

// Migrator Steps
enum STEP {
  Waiting,
  // Creating,
  // Configuring,
  Migrating, // This is what the Migrator gives, TODO potentially refactor for split
  Completed,
  Failed
}

// Possible state of each Tx
enum TX_STATE {
  Broadcasting, // Waiting to be signed
  Waiting, // Waiting to be mined
  Confirmed,
  Failed,
  Lost // If tx is taking an exceedingly long time
}

const Migrator: FC<IProps> = ({
  dao,
  onComplete,
  onStart,
  onAbort,
  onStop
}: IProps) => {
  /*
   * State
   */

  const [step, setStep] = useState(STEP.Waiting);
  // Contains transactions
  const [txList, setTxList] = useState({});
  // Whether or not there is a web3 instance(?)
  const [noWeb3Open, setNoWeb3Open] = useState(false);
  const [fullLogLines, setFullLogLines] = useState<AnyLogLine[]>([]);
  const [minimalLogLines, setMinimalLogLines] = useState<string[]>([]);
  const [ethSpent, setEthSpent] = useState(0);
  const [result, setResult] = useState<DAOMigrationResult | undefined>(
    undefined
  );
  const [approval, setApproval] = useState<
    undefined | { msg: string; response: (res: boolean) => void }
  >(undefined);

  // TODO
  const resetState = () => {
    setStep(STEP.Waiting);
    setTxList({});
    setNoWeb3Open(false);
  };

  const nextStep = () => {
    console.log("Go to next step");
    setStep(step => step++);
  };

  /*
   * Start
   */

  const startInstallation = async () => {
    console.log("Starting Installation");

    // Reset state
    setNoWeb3Open(false);
    setMinimalLogLines([]);
    setEthSpent(0);
    setResult(undefined);
    setApproval(undefined);

    // Make sure we have a web3 provider available. If not,
    // tell the user they need to have one.
    let web3 = undefined;

    try {
      web3 = await getWeb3();
    } catch (e) {
      console.log(e);
    }

    if (!web3) {
      setNoWeb3Open(true);
      return;
    }

    // Alert in case of user closing window while deploying
    window.onbeforeunload = () => {
      return "Your migration is still in progress. Do you really want to leave?";
    };

    // Clear the log
    setFullLogLines([]);
    setMinimalLogLines([]);

    onStart(); // props

    const callbacks: DAOMigrationCallbacks = getCallbacks();
    setResult(undefined);

    migrateDAO(dao, callbacks);

    createOrganisation();

    // Result used to be set here and within onComplete in callbacks (onStop was similar)

    // nextStep();
  };

  const createOrganisation = () => {
    setStep(STEP.Creating);
  };

  const configureOrganisation = () => {
    setStep(STEP.Configuring);
  };

  const completeOrganisation = (result: DAOMigrationResult) => {
    console.log("completeOrganisation result:");
    console.log(result);
    setStep(STEP.Completed);
    // onComplete(result);
  };

  /*
   * Callbacks
   */

  const addLogLine = (logLine: AnyLogLine) => {
    console.log(logLine);
    setFullLogLines([...fullLogLines, logLine]);

    const { UserApproval, Info, Error } = LogType;
    switch (logLine.type) {
      case UserApproval:
        const approvalLine = logLine as LogUserApproval;
        const { question } = approvalLine;
        switch (question) {
          case "About to migrate new DAO. Continue?":
            approvalLine.onResponse(true);
            console.log("Answering true to: " + question);
            break;

          case "We found a deployment that was in progress, pickup where you left off?":
            setMinimalLogLines([...minimalLogLines, question]);
            setApproval({
              msg: question,
              response: (res: boolean): void => {
                setApproval(undefined);
                approvalLine.onResponse(res);
              }
            });
            break;

          default:
            console.log("Unhandled approval log:");
            console.log(question);
            setMinimalLogLines([...minimalLogLines, question]);
            setApproval({
              msg: question,
              response: (res: boolean): void => {
                setApproval(undefined);
                approvalLine.onResponse(res);
              }
            });
            break;
        }
        break;

      case Info:
        const infoLine = logLine as LogInfo;
        const { info } = infoLine;
        switch (info) {
          case "Migrating DAO...":
            break;

          case "Creating a new organization...":
            setMinimalLogLines([...minimalLogLines, "Sign Transaction"]);
            break;

          case "DAO Migration has Finished Successfully!":
            setMinimalLogLines([...minimalLogLines, "Confirmed"]);
            completeOrganisation(infoLine as any);
            break;

          default:
            console.log("Unhandled info log:");
            console.log(info);
            setMinimalLogLines([...minimalLogLines, info]);
            break;
        }
        break;

      case Error:
        const errorLine = logLine as LogError;
        const { error } = errorLine;
        switch (error) {
          case "MetaMask Tx Signature: User denied transaction signature.":
            setMinimalLogLines([
              ...minimalLogLines,
              "Failed to Sign Transaction"
            ]);
            // Reset to last step (set button to tx rebroadcast attempt)
            break;

          default:
            console.log("Unhandled error log:");
            console.log(error);
            setMinimalLogLines([...minimalLogLines, error]);
            break;
        }
    }
  };

  const getCallbacks = () => {
    const callbacks: DAOMigrationCallbacks = {
      userApproval: (msg: string): Promise<boolean> =>
        new Promise<boolean>(resolve =>
          addLogLine(new LogUserApproval(msg, (resp: boolean) => resolve(resp)))
        ),

      info: (msg: string) => addLogLine(new LogInfo(msg)),

      error: (msg: string) => addLogLine(new LogError(msg)),

      txComplete: (msg: string, txHash: string, txCost: number) =>
        new Promise<void>(resolve => {
          addLogLine(new LogTransactionResult(msg, txHash, txCost));
          setEthSpent(ethSpent => (ethSpent += Number(txCost)));
          resolve();
        }),

      migrationAborted: (err: Error) => {
        window.onbeforeunload = () => {
          return undefined;
        };
        addLogLine(new LogMigrationAborted(err));

        setStep(STEP.Waiting);

        onAbort(err); // props
      },

      migrationComplete: (result: DAOMigrationResult) => {
        window.onbeforeunload = () => {
          return undefined;
        };
        setResult(result);
        setStep(STEP.Completed);

        onComplete(result); // props
      },

      getState: () => {
        const localState = localStorage.getItem("DAO_MIGRATION_STATE");
        return localState ? JSON.parse(localState) : {};
      },

      setState: (state: any) => {
        localStorage.setItem("DAO_MIGRATION_STATE", JSON.stringify(state));
      },

      cleanState: () => {
        localStorage.removeItem("DAO_MIGRATION_STATE");
      }
    };
    return callbacks;
  };

  const openAlchemy = () => {
    console.log("Open Alchemy");
  };

  return (
    <MDBContainer>
      {approval && (
        <Fragment>
          <MDBRow center>
            <div>{approval.msg}</div>
          </MDBRow>
          <MDBBtnGroup center>
            <MDBBtn onClick={() => approval.response(true)}>Yes</MDBBtn>
            <MDBBtn onClick={() => approval.response(false)}>No</MDBBtn>
          </MDBBtnGroup>
        </Fragment>
      )}
      <CreateOrganisation
        nextStep={nextStep}
        logLines={minimalLogLines}
        running={step !== STEP.Waiting}
      />
      <ConfigureOrganisation nextStep={nextStep} />

      {/* Install Organisation Button */}
      <MDBRow center>
        {step !== STEP.Completed ? (
          <MDBBtn
            disabled={step !== STEP.Waiting}
            onClick={() => startInstallation()}
          >
            Install Organisation
          </MDBBtn>
        ) : (
          <MDBBtn onClick={() => openAlchemy()}>Open Alchemy</MDBBtn>
        )}
      </MDBRow>
    </MDBContainer>
  );
};

export default Migrator;
