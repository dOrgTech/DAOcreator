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
    <MDBBox>
      <form onSubmit={onSubmit}>
        <MDBRow>
          <MDBCol md="6">
            <MDBBox>
              <FormField
                field={memberForm.$.address}
                editable={true}
              ></FormField>
            </MDBBox>
          </MDBCol>
          <MDBCol md="6">
            <MDBBox>
              <MDBBtn
                color="blue darken-4"
                size="sm"
                type="submit"
                style={styles.setDescriptionButton}
              >
                Add Member
              </MDBBtn>
            </MDBBox>
          </MDBCol>
        </MDBRow>
      </form>
    </MDBBox>
  );
};

const styles = {
  setDescriptionButton: {
    borderRadius: "0.37rem",
    fontWeight: 700
  }
};
