import React, { FC, useState } from "react";
import {
  DAOMigrationParams,
  DAOMigrationResult,
  getWeb3
} from "@dorgtech/daocreator-lib";
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from "mdbreact";
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
  Creating,
  Configuring,
  Completed
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
  const [fullLogLines, setFullLogLines] = useState([]);
  const [minimalLogLines, setMinimalLogLines] = useState([]);

  const resetState = () => {
    setStep(STEP.Waiting);
    setTxList({});
    setNoWeb3Open(false);
  };

  const nextStep = () => {
    console.log("Go to next step");
    setStep(step + 1);
  };

  /*
   * Start
   */

  const startInstallation = async () => {
    console.log("Starting Installation");

    if (step !== STEP.Waiting) return;

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
    window.onbeforeunload = function() {
      return "Your migration is still in progress. Do you really want to leave?";
    };

    // Clear the log
    setFullLogLines([]);
    setMinimalLogLines([]);

    // Prop call
    onStart();

    // Migrate Dao

    nextStep();
  };

  const openAlchemy = () => {
    console.log("Open Alchemy");
  };

  return (
    <MDBContainer>
      <CreateOrganisation nextStep={nextStep} />
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
