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
    Create,
    Configure
  }

  // Possible state of each Tx
  enum TXSTATE {
    Broadcasting, // Waiting to be signed
    Waiting, // Waiting to be mined
    Confirmed,
    Failed,
    Lost // If tx is taking an exceedingly long time
  }

  const [step, setStep] = useState(STEP.Create);
  // Contains transactions
  const [txState, setTxState] = useState({});

  const startInstallation = () => {
    console.log("Start Installation");
  };

  const nextStep = () => {
    console.log("Go to next step");
    setStep(STEP.Configure);
  };

  return (
    <MDBContainer>
      <CreateOrganisation nextStep={nextStep} />
      <ConfigureOrganisation nextStep={nextStep} />

      {/* Install Organisation Button */}
      <MDBRow center>
        <MDBBtn onClick={() => startInstallation()}>
          Install Organisation
        </MDBBtn>
      </MDBRow>
    </MDBContainer>
  );
};

export default Migrator;
