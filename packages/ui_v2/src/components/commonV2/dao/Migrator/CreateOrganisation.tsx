import React, { FC, useState, useEffect } from "react";
import { MDBRow, MDBCol } from "mdbreact";
import { AnyLogLine } from "./LogLineTypes";

interface IProps {
  nextStep: () => void;
  logLines: AnyLogLine[];
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
  logLines
}: IProps) => {
  const [step, setStep] = useState(STEP.Waiting);
  const [output, setOutput] = useState(
    <div style={{ float: "right" }}>Start Installation</div>
  );

  useEffect(() => {
    switch (step) {
      case STEP.Waiting:
        setOutput(<div style={{ float: "right" }}>Start Installation</div>);
    }
  }, [step]);

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
