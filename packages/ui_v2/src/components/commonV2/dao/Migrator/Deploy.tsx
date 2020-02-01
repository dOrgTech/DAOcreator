import React, { Fragment, useState } from "react";
import { MDBBtn, MDBRow } from "mdbreact";
import { observer } from "mobx-react";
import {
  DAOMigrationParams,
  DAOMigrationResult,
  getWeb3,
  DAOMigrationCallbacks,
  migrateDAO,
  getNetworkName,
  DAOForm,
  toDAOMigrationParams
} from "@dorgtech/daocreator-lib";
// DAOMigrationParams,
// DAOMigrationResult,
// getWeb3,
// DAOMigrationCallbacks,
// migrateDAO,
// getNetworkName
enum STEP {
  Waiting,
  Creating,
  Configuring,
  Completed
}

interface DeployProps {
  disabled?: boolean;
  dao: DAOForm;
  step?: number;
  failed?: boolean | null;
  setNoWeb3Open?: any;
  setMinimalLogLines?: any;
  setEthSpent?: any;
  setResult?: any;
  setApproval?: any;
  setFailed?: any;
  setFullLogLines?: any;
}

const onStart = (): any => {};

const getCallbacks = (): any => {};

const createOrganisation = (): any => {};

const onComplete = (_result?: any) => {};
function Deploy({
  dao,
  step,
  failed,
  setNoWeb3Open = () => {},
  setMinimalLogLines = () => {},
  setEthSpent = () => {},
  setApproval = () => {},
  setFailed = () => {},
  setFullLogLines = () => {}
}: DeployProps) {
  const [result, setResult] = useState<DAOMigrationResult | undefined>(
    undefined
  );
  const startInstallation = async () => {
    console.log("Starting Installation");

    // Reset state
    setNoWeb3Open(false);
    setMinimalLogLines([]);
    setEthSpent(0);
    setResult(undefined);
    setApproval(undefined);
    setFailed(null);

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
    const daoState: DAOMigrationParams = toDAOMigrationParams(dao.toState());
    const result = await migrateDAO(daoState, callbacks);
    // Getting around unimplemented callback
    if (!result) return;
    onComplete(result);
    setResult(result);
    window.onbeforeunload = () => {};
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
    <div className="row justify-content-center">
      <MDBRow center>
        {step !== STEP.Completed ? (
          <MDBBtn
            disabled={(step !== STEP.Waiting && failed === null) || false}
            onClick={() => startInstallation()}
          >
            {/*failed === null ? "Install Organisation" : `Restart Installation ${step}`*/}
            Install Organization
          </MDBBtn>
        ) : (
          <Fragment>
            <MDBBtn onClick={() => openAlchemy()}>Open Alchemy</MDBBtn>
            <MDBBtn onClick={() => startInstallation()}>Redeploy</MDBBtn>
          </Fragment>
        )}
      </MDBRow>
    </div>
  );
}

export default observer(Deploy);
