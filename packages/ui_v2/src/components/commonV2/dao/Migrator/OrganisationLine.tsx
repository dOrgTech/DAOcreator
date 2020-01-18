import React, { FC, useState, useEffect } from "react";
import { MDBRow, MDBCol } from "mdbreact";

interface IProps {
  type: number;
  active: boolean;
  logLines: string[];
}

enum STEP {
  Waiting, // Before installation
  Start,
  // Sign,
  // View, // View on Etherscan should display after tx is signed but we are not currently handling this TODO (?)
  Confirmed, // Go to next step
  Failed // Reset to start
}

export const OrganisationLine: FC<IProps> = ({
  type,
  active,
  logLines
}: IProps) => {
  const [step, setStep] = useState(STEP.Waiting);
  const [output, setOutput] = useState(
    <div style={{ float: "right" }}>
      {type === 0 ? "Start Installation" : "Waiting"}
    </div>
  );

  // Inactive states can only be STEP.Waiting and STEP.Confirmed
  useEffect(() => {
    if (!active) {
      if (step === STEP.Confirmed) return;
      setStep(STEP.Waiting);
      return;
    }
    if (step === STEP.Waiting) setStep(STEP.Start);
  }, [active]);

  useEffect(() => {
    if (!active) return;

    switch (step) {
      case STEP.Waiting:
        setOutput(
          <div style={{ float: "right" }}>
            {type === 0 ? "Start Installation" : "Waiting"}
          </div>
        );
        break;
      case STEP.Start:
        if (logLines[logLines.length - 1] === "Confirmed")
          setStep(STEP.Confirmed);
        setOutput(
          <div style={{ float: "right" }}>{logLines[logLines.length - 1]}</div>
        );
        break;
      case STEP.Confirmed:
        setOutput(
          <div style={{ float: "right" }}>Confirmed</div> // Should link to txHash
        );
        break;
    }
  }, [step, logLines]);

  return (
    <MDBRow>
      <MDBCol size="2">ICON</MDBCol>
      <MDBCol size="6">
        <div>
          {type === 0 ? "Create Organisation" : "Configure Organisation"}
        </div>
      </MDBCol>
      <MDBCol size="4">{output}</MDBCol>
    </MDBRow>
  );
};

export default OrganisationLine;
