import React, { FC, useState } from "react";
import {
  DAOMigrationParams,
  DAOMigrationResult
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

const Migrator: FC<IProps> = ({
  dao,
  onComplete,
  onStart,
  onAbort,
  onStop
}: IProps) => {
  // Migrator Step
  enum STEP {
    Waiting,
    Creating,
    Configuring,
    Completed
  }

  // Possible state of each Tx
  enum TXSTATE {
    Broadcasting, // Waiting to be signed
    Waiting, // Waiting to be mined
    Confirmed,
    Failed,
    Lost // If tx is taking an exceedingly long time
  }

  const [step, setStep] = useState(STEP.Waiting);
  // Contains transactions
  const [txList, setTxList] = useState({});

  const nextStep = () => {
    console.log("Go to next step");
    setStep(step + 1);
  };

  const startInstallation = () => {
    console.log("Start Installation");
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
