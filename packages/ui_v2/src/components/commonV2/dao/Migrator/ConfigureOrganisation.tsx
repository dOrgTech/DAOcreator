import React, { FC, useState } from "react";
import { MDBRow, MDBCol } from "mdbreact";

interface IProps {
  nextStep: () => void;
}

enum STEP {
  Waiting, // Before installation
  Start,
  Sign,
  View,
  Confirmed, // Go to next step
  Failed // Reset to start
}

export const ConfigureOrganisation: FC<IProps> = ({ nextStep }: IProps) => {
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
