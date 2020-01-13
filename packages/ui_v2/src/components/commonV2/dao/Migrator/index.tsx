import React, { FC, useState } from "react";
import {
  DAOMigrationParams,
  DAOMigrationResult
} from "@dorgtech/daocreator-lib";
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from "mdbreact";

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

  // Contains transactions
  const [txState, setTxState] = useState({});
  const [step, setStep] = useState(STEP.Create);

  // const start;

  return (
    <MDBContainer>
      {/* Create Organisation */}
      <MDBRow>
        <MDBCol size="2">ICON</MDBCol>
        <MDBCol size="6">
          <div>Create Organisation</div>
        </MDBCol>
        <MDBCol size="4">{}</MDBCol>
      </MDBRow>

      {/* Configure Organisation */}
      <MDBRow>
        <MDBCol size="2">ICON</MDBCol>
        <MDBCol size="6">
          <div>Configure Organisation</div>
        </MDBCol>
        <MDBCol size="4">{}</MDBCol>
      </MDBRow>

      {/* Install Organisation Button */}
      <MDBRow center>
        <MDBBtn onClick={() => console.log("Start installation")}>
          Install Organisation
        </MDBBtn>
      </MDBRow>
    </MDBContainer>
  );
};

export default Migrator;
