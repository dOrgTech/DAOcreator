import React, { FC, useState, Fragment } from "react";
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
        <MDBCol>ICON</MDBCol>
        <MDBCol>
          <div>Create Organisation</div>
        </MDBCol>
        <MDBCol>{}</MDBCol>
      </MDBRow>

      {/* Configure Organisation */}
      <MDBRow>
        <MDBCol>ICON</MDBCol>
        <MDBCol>
          <div>Configure Organisation</div>
        </MDBCol>
        <MDBCol>{}</MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Migrator;
