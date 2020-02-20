import React, { FC } from "react";
import { MembersForm } from "@dorgtech/daocreator-lib";
import { MDBRow, MDBCol, MDBBox, MDBContainer } from "mdbreact";

import MembersEditor from "../commonV2/dao/Members/MembersEditor";

interface Props {
  form: MembersForm;
  toggleCollapse: () => void;
}

const MembersStep: FC<Props> = ({ form, toggleCollapse }: Props) => (
  <MDBContainer style={styles.padding}>
    <MDBBox>
      <MembersEditor form={form} />
      <MDBRow style={styles.padding}>
        <MDBCol>
          <button style={styles.setDescriptionButton} onClick={toggleCollapse}>
            Set Members
          </button>
        </MDBCol>
      </MDBRow>
    </MDBBox>
  </MDBContainer>
);

const styles = {
  setDescriptionButton: {
    borderRadius: "0.37rem",
    height: "45px",
    fontWeight: 300,
    backgroundColor: "#1976d2",
    color: "white",
    width: "145px",
    padding: "7px",
    marginBottom: "11px",
    fontSize: "smaller"
  },
  padding: {
    padding: "4px"
  }
};

export default MembersStep;
