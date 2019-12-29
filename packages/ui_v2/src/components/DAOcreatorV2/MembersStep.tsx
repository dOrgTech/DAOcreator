import * as React from "react";
import { MembersForm } from "@dorgtech/daocreator-lib";
import { MDBBtn, MDBRow, MDBCol, MDBBox } from "mdbreact";

import MembersEditor from "components/commonV2/dao/Members/MembersEditor";

interface Props {
  form: MembersForm;
  getDAOTokenSymbol: () => string;
  toggleCollapse: () => void;
}

function MembersStep(props: Props) {
  const { form, getDAOTokenSymbol, toggleCollapse } = props;
  return (
    <MDBBox>
      <MembersEditor form={form} getDAOTokenSymbol={getDAOTokenSymbol} />
      <MDBRow>
        <MDBCol>
          <MDBBtn
            color="blue darken-4"
            size="sm"
            name="decisonSpeed"
            value="slow"
            style={styles.setDescriptionButton}
            onClick={() => toggleCollapse()}
          >
            Set members
          </MDBBtn>
        </MDBCol>
      </MDBRow>
    </MDBBox>
  );
}

const styles = {
  setDescriptionButton: {
    borderRadius: "0.37rem",
    fontWeight: 700
  }
};

export default MembersStep;
