import React, { FC } from "react";
import { MDBRow, MDBCol } from "mdbreact";

export const ConfigureOrganisation: FC = () => {
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
