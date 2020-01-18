import React, { FC, useState } from "react";
import { MDBRow, MDBCol } from "mdbreact";

interface IProps {
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

export const ConfigureOrganisation: FC<IProps> = ({
  active,
  logLines
}: IProps) => {
  const [step, setStep] = useState(STEP.Waiting);

  return (
    <MDBRow>
      <MDBCol size="2">ICON</MDBCol>
      <MDBCol size="6">
        <div>Configure Organisation</div>
      </MDBCol>
      <MDBCol size="4">{}</MDBCol>
    </MDBRow>
  );
};

export default ConfigureOrganisation;
