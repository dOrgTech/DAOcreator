import React, { FC, useState, useEffect } from "react";
import { MDBRow, MDBCol, MDBBtnGroup, MDBBtn, MDBBox } from "mdbreact";
import { AnyLogLine, LogUserApproval } from "./LogLineTypes";

interface IProps {
  nextStep: () => void;
  logLines: string[];
  running: boolean;
}

enum STEP {
  Waiting, // Before installation
  Start,
  Sign,
  View,
  Confirmed, // Go to next step
  Failed // Reset to start
}

export const CreateOrganisation: FC<IProps> = ({
  nextStep,
  logLines,
  running
}: IProps) => {
  const [step, setStep] = useState(STEP.Waiting);
  const [output, setOutput] = useState(
    <div style={{ float: "right" }}>Start Installation</div>
  );

  useEffect(() => {
    if (!running) {
      setStep(STEP.Waiting);
      return;
    }
    if (step === STEP.Waiting) setStep(STEP.Start);
  }, [running]);

  useEffect(() => {
    switch (step) {
      case STEP.Waiting:
        setOutput(<div style={{ float: "right" }}>Start Installation</div>);
        break;
      case STEP.Start:
        setOutput(
          <div style={{ float: "right" }}>{logLines[logLines.length - 1]}</div>
        );
        break;
    }
  }, [step, logLines]);

  return (
    <MDBRow>
      <MDBCol size="2">ICON</MDBCol>
      <MDBCol size="6">
        <div>Create Organisation</div>
      </MDBCol>
      <MDBCol size="4">{output}</MDBCol>
    </MDBRow>
  );
};

export default CreateOrganisation;
