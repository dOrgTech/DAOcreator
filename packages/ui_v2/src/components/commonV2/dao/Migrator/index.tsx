import React, { FC, useState, Fragment, useEffect } from "react";
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
  onComplete: (result: DAOMigrationResult, alchemyURL: string) => void;
  onStart: () => void;
  onAbort: (error: string) => void;
  onStop: () => void;
}

// Migrator Steps
enum STEP {
  Waiting,
  Creating,
  Configuring,
  Completed
}

// Migrator Steps
enum FAILED {
  Create,
  Config
}

const Migrator: FC<IProps> = ({
  dao,
  onComplete,
  onStart,
  onAbort
}: // onStop
IProps) => {
  /*
   * State
   */

  const [step, setStep] = useState(STEP.Waiting);

  // Unimplemented noWeb3Open, ethSpent
  const [, setNoWeb3Open] = useState(false);
  const [, setEthSpent] = useState(0);

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

  // Alchemy url
  const [alchemyURL, setAlchemyURL] = useState("");

  const [aborting, setAborting] = useState(false);

  const [failed, setFailed] = useState<FAILED | null>(null);

  useEffect(() => {
    if (!aborting) return;

    setAborting(false);
    if (step === STEP.Creating) setFailed(FAILED.Create);
    else if (step === STEP.Configuring) setFailed(FAILED.Config);
  }, [aborting, step]);

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
            setMinimalLogLines([...minimalLogLines, "Selecting deployment..."]);
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
            break;

          case info === "Creating a new organization...":
            setMinimalLogLines([
              ...minimalLogLines,
              "Signing Create Org Tx..."
            ]);
            break;

          case info === "Setting DAO schemes...":
          case info === "Deploying Controller":
            setMinimalLogLines([
              ...minimalLogLines,
              "Signing Config Org Txs..."
            ]);
            break;

          case info === "DAO Migration has Finished Successfully!":
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
            "Transaction failed: MetaMask Tx Signature: User denied transaction signature.": // Most (all?) also cause an abort so the message shown in Line reverts back to default
            // setMinimalLogLines([
            //   ...minimalLogLines,
            //   "Failed to Sign Transaction"
            // ]);
            break;

          case error.startsWith('Provided address "null" is invalid'): // Happened in dev a lot
            setMinimalLogLines([...minimalLogLines, "Failed to get address"]);
            break;

          case error.startsWith(
            "Transaction failed: Transaction has been reverted"
          ):
          case error.startsWith("Transaction failed: Error"):
            // setMinimalLogLines([...minimalLogLines, "Transaction failed"]);
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
        const { msg } = txLine;
        switch (true) {
          case msg === "Created new organization.":
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

        setAborting(true);

        switch (true) {
          case abortedMsg ===
            "MetaMask Tx Signature: User denied transaction signature.":
            setMinimalLogLines([
              ...minimalLogLines,
              "Failed to Sign Transaction"
            ]);
            break;

          case abortedMsg ===
            "Returned values aren't valid, did it run Out of Gas?":
          case abortedMsg.startsWith("Error: "):
            setMinimalLogLines([...minimalLogLines, "Transaction failed"]);
            break;

          default:
            console.log("Unhandled abortedMsg log:");
            console.log(abortedMsg);
            setMinimalLogLines([...minimalLogLines, abortedMsg]);
            break;
        }
        break;

      default:
        console.log("Unimplemented log type");
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

        onAbort(err.toString()); // props
      },

      migrationComplete: (result: DAOMigrationResult) => {
        // Unimplemented callback

        window.onbeforeunload = () => {};
        setResult(result);
        setStep(STEP.Completed);

        //onComplete(result); // props
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
    setFailed(null);
    setAlchemyURL("");

    // Make sure we have a web3 provider available. If not,
    // tell the user they need to have one. TODO
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

    const network = await getNetworkName();

    let url;
    if (network === "mainnet")
      url = `https://alchemy.daostack.io/dao/${result.Avatar}`;
    else if (network === "rinkeby")
      url = `https://alchemy-staging-rinkeby.herokuapp.com/dao/${result.Avatar}`;
    else url = result.Avatar;

    setAlchemyURL(url);

    onComplete(result, url);
    setResult(result);
    window.onbeforeunload = () => {};
  };

  const openAlchemy = async () => {
    if (!result) {
      console.log("Failed to open: Result wasn't set");
      return;
    }

    window.open(alchemyURL);
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
        failed={failed === FAILED.Create}
        logLines={minimalLogLines}
      />

      {/* Configure Organisation */}
      <OrganisationLine
        type={1}
        active={step === STEP.Configuring}
        done={step === STEP.Completed}
        failed={failed === FAILED.Config}
        logLines={minimalLogLines}
      />

      {/* Install Organisation Button */}
      <MDBRow center>
        {step !== STEP.Completed ? (
          <MDBBtn
            disabled={step !== STEP.Waiting && failed === null}
            onClick={() => startInstallation()}
          >
            {failed === null ? "Install Organisation" : "Restart Installation"}
          </MDBBtn>
        ) : (
          <Fragment>
            <MDBBtn onClick={() => openAlchemy()}>Open Alchemy</MDBBtn>
            <MDBBtn onClick={() => startInstallation()}>Redeploy</MDBBtn>
          </Fragment>
        )}
      </MDBRow>
    </MDBContainer>
  );
};

export default Migrator;
