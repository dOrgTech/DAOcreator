import React, { FC, useState, Fragment } from "react";
import {
  DAOMigrationParams,
  DAOMigrationResult,
  getWeb3,
  DAOMigrationCallbacks,
  migrateDAO,
  getNetworkName
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
import OrganisationLine from "./OrganisationLine";

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
  Creating,
  Configuring,
  Completed,
  Failed
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

  // Unimplemented
  const [noWeb3Open, setNoWeb3Open] = useState(false);
  const [ethSpent, setEthSpent] = useState(0);

  // Array of log lines as given by callbacks
  const [fullLogLines, setFullLogLines] = useState<AnyLogLine[]>([]);

  // Heavily redacted log lines
  const [minimalLogLines, setMinimalLogLines] = useState<string[]>([]);

  // User approval component
  const [approval, setApproval] = useState<
    undefined | { msg: string; response: (res: boolean) => void }
  >(undefined);

  // Migration result (sans schemes), outdated if resuming
  const [result, setResult] = useState<DAOMigrationResult | undefined>(
    undefined
  );

  /*
   * Step Transitions
   */

  const createOrganisation = () => {
    setStep(STEP.Creating);
  };

  const configureOrganisation = () => {
    setStep(STEP.Configuring);
  };

  const completeOrganisation = () => {
    //result: DAOMigrationResult // We're not getting this yet
    setStep(STEP.Completed);
    // onComplete(result);
  };

  /*
   * Callbacks
   */

  const addLogLine = (logLine: AnyLogLine) => {
    const { type } = logLine;
    setFullLogLines([...fullLogLines, logLine]);

    const {
      UserApproval,
      Info,
      Error,
      TransactionResult,
      MigrationAborted
    } = LogType;

    console.log(logLine);

    switch (type) {
      case UserApproval:
        const approvalLine = logLine as LogUserApproval;
        const { question } = approvalLine;
        switch (question) {
          case "About to migrate new DAO. Continue?":
            approvalLine.onResponse(true);
            console.log("Answering true to: " + question);
            break;

          case "We found a deployment that was in progress, pickup where you left off?":
          case "We found a deployment that's was in progress, pickup where you left off?":
            setMinimalLogLines([
              ...minimalLogLines,
              "Continue previous deployment?"
            ]);
            setApproval({
              msg: "Continue previous deployment?",
              response: (res: boolean): void => {
                res && configureOrganisation();
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
        switch (true) {
          case info === "Migrating DAO...":
          case info.startsWith("Using Arc Version:"):
            console.log("continuing");
            break;

          case info === "Creating a new organization...":
            setMinimalLogLines([...minimalLogLines, "Sign Transaction"]);
            break;

          case info === "Setting DAO schemes...":
          case info === "Deploying Controller":
            setMinimalLogLines([...minimalLogLines, "Sign Transaction"]);
            break;

          case info === "DAO Migration has Finished Successfully!": // TODO state changes are happening too fast and this can get triggered in wrong state
            setMinimalLogLines([...minimalLogLines, "Confirmed"]);
            completeOrganisation(); // Hack to complete until callback is implemented
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
        switch (true) {
          case error ===
            "Transaction failed: MetaMask Tx Signature: User denied transaction signature.":
            setMinimalLogLines([
              ...minimalLogLines,
              "Failed to Sign Transaction"
            ]);
            // Reset to last step (set button to tx rebroadcast attempt)
            break;

          case error.startsWith('Provided address "null" is invalid'): // Happened in dev a lot
            setMinimalLogLines([...minimalLogLines, "Failed to get address"]);
            // Reset to last step (set button to tx rebroadcast attempt)
            break;

          case error.startsWith(
            "Transaction failed: Transaction has been reverted"
          ):
            setMinimalLogLines([...minimalLogLines, "Transaction failed"]);
            break;

          default:
            console.log("Unhandled error log:");
            console.log(error);
            setMinimalLogLines([...minimalLogLines, error]);
            break;
        }
        break;

      case TransactionResult:
        const txLine = logLine as LogTransactionResult;
        const { msg, txHash, txCost } = txLine;
        switch (true) {
          case msg === "Created new organization.":
            setMinimalLogLines([
              ...minimalLogLines,
              "Confirmed" // Should pass txHash onClick
            ]);
            configureOrganisation();
            break;

          case msg.startsWith('Provided address "null" is invalid'): // Happened in dev a lot
            setMinimalLogLines([...minimalLogLines, "Failed to get address"]);
            // Reset to last step (set button to tx rebroadcast attempt)
            break;

          case msg === "DAO schemes set.":
            setMinimalLogLines([...minimalLogLines, msg]);
            break;

          default:
            console.log("Unhandled txResult log:");
            console.log(msg);
            setMinimalLogLines([...minimalLogLines, msg]);
            break;
        }
        break;

      case MigrationAborted:
        const abortedLine = logLine as LogMigrationAborted;
        const abortedMsg = abortedLine.toString();
        switch (true) {
          case abortedMsg ===
            "MetaMask Tx Signature: User denied transaction signature.":
          case abortedMsg ===
            "Returned values aren't valid, did it run Out of Gas?":
            break;

          default:
            console.log("Unhandled abortedMsg log:");
            console.log(abortedMsg);
            break;
        }
        break;

      default:
        throw "Unimplemented log type";
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
        window.onbeforeunload = () => {};

        addLogLine(new LogMigrationAborted(err));

        setStep(STEP.Waiting);

        onAbort(err); // props
      },

      migrationComplete: (result: DAOMigrationResult) => {
        window.onbeforeunload = () => {};
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

    // Alert in case of user closing window while deploying, message is generic on modern browsers
    window.onbeforeunload = () => {
      return "Your migration is still in progress. Do you really want to leave?";
    };

    // Clear the log
    setFullLogLines([]);
    setMinimalLogLines([]);

    onStart(); // props

    const callbacks: DAOMigrationCallbacks = getCallbacks();
    setResult(undefined);

    createOrganisation();

    const result = await migrateDAO(dao, callbacks);
    // Getting around unimplemented callback
    if (!result) return;
    onComplete(result);
    setResult(result);
  };

  const openAlchemy = async () => {
    if (!result) {
      console.log("Failed to open: Result wasn't set");
      return;
    }

    const network = await getNetworkName();
    let url;

    if (network === "mainnet") {
      url = `https://alchemy.daostack.io/dao/${result.Avatar}`;
    } else if (network === "rinkeby") {
      url = `https://alchemy-staging-rinkeby.herokuapp.com/dao/${result.Avatar}`;
    } else {
      url = result.Avatar;
    }

    window.open(url);
  };

  return (
    <MDBContainer>
      {approval && approval.msg && (
        <Fragment>
          <MDBRow center>
            <div>{approval.msg}</div>
          </MDBRow>
          <MDBRow center>
            <MDBBtnGroup>
              <MDBBtn onClick={() => approval.response(true)}>Yes</MDBBtn>
              <MDBBtn onClick={() => approval.response(false)}>No</MDBBtn>
            </MDBBtnGroup>
          </MDBRow>
        </Fragment>
      )}

      {/* Create Organisation */}
      <OrganisationLine
        type={0}
        active={step === STEP.Creating}
        done={step === STEP.Configuring || step === STEP.Completed}
        logLines={minimalLogLines}
      />

      {/* Configure Organisation */}
      <OrganisationLine
        type={1}
        active={step === STEP.Configuring}
        done={step === STEP.Completed}
        logLines={minimalLogLines}
      />

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
