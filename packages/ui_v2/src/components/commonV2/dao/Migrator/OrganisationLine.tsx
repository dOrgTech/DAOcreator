import React, { FC, useState, useEffect } from "react";
import { MDBRow, MDBCol } from "mdbreact";

interface IProps {
  type: number;
  active: boolean;
  done: boolean;
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
  done,
  logLines
}: IProps) => {
  const [step, setStep] = useState<STEP>(STEP.Waiting);
  const [lastLog, setLastLog] = useState<string>(
    type === 0 ? "Start Installation" : "Waiting"
  );

  useEffect(() => {
    if (done) {
      if (step === STEP.Confirmed) return;
      setStep(STEP.Confirmed);
      return;
    }

    if (!active) {
      if (step === STEP.Waiting) return;
      setStep(STEP.Waiting);
    }

    if (step === STEP.Start) return;
    setStep(STEP.Start);
  }, [active, done, step]);

  useEffect(() => {
    if (!active || done) return;
    setLastLog(logLines[logLines.length - 1]);
  }, [logLines, active, done]);

  const Output: FC = () => {
    let text = undefined;

    switch (step) {
      case STEP.Waiting:
        text = type === 0 ? "Start Installation" : "Waiting";
        break;

      case STEP.Start:
        text = lastLog;
        break;

      case STEP.Confirmed:
        text = "Confirmed";
        break;

      default:
        console.log("Unimplemented step");
    }

    return <div style={{ float: "right" }}>{text}</div>; // Should link to txHash
  };

  return (
    <MDBRow>
      <MDBCol size="2">ICON</MDBCol>
      <MDBCol size="6">
        <div>
          {type === 0 ? "Create Organisation" : "Configure Organisation"}
        </div>
      </MDBCol>
      <MDBCol size="4">
        <Output />
      </MDBCol>
    </MDBRow>
  );
};

export default OrganisationLine;
