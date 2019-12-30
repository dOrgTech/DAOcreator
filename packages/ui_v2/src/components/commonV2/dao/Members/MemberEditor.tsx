import React from "react";
import { MDBBox, MDBRow, MDBCol, MDBBtn } from "mdbreact";

import FormField from "components/commonV2/FormField";

export const MemberEditor = ({
  memberForm,
  onSubmit
}: {
  memberForm: any;
  onSubmit: any;
}) => {
  return (
    <MDBRow>
      <FormField
        field={memberForm.$.address}
        editable={true}
        colSize="9"
      ></FormField>
      <MDBCol size="3" style={styles.buttonRow}>
        <MDBBtn
          color="blue darken-4"
          size="sm"
          type="submit"
          style={styles.setDescriptionButton}
          onClick={onSubmit}
        >
          Add Member
        </MDBBtn>
      </MDBCol>
    </MDBRow>
  );
};

const styles = {
  setDescriptionButton: {
    borderRadius: "0.37rem",
    fontWeight: 700
  },
  buttonRow: {}
};
