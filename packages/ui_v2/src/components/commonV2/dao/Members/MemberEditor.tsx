import React from "react";
import { MDBRow, MDBCol } from "mdbreact";

import FormField from "components/commonV2/FormField";

export const MemberEditor = ({
  memberForm,
  onSubmit
}: {
  memberForm: any;
  onSubmit: any;
}) => {
  return (
    <MDBRow style={styles.rowPrincipal}>
      <FormField
        field={memberForm.$.address}
        editable={true}
        colSize="9"
      ></FormField>
      <MDBCol size="3" style={styles.buttonRow}>
        <button
          type="submit"
          style={styles.setDescriptionButton}
          onClick={onSubmit}
        >
          Add Member
        </button>
      </MDBCol>
    </MDBRow>
  );
};

const styles = {
  setDescriptionButton: {
    borderRadius: "0.37rem",
    fontWeight: 300,
    height: "39px",
    padding: "8px",
    fontFamily: "inherit",
    fontSize: "14px",
    width: "inherit"
  },
  buttonRow: {
    alignSelf: "flex-end"
  },
  rowPrincipal: {
    margin: 0,
    width: "100%",
    padding: "4px"
  }
};
