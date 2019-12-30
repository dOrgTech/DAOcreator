import React from "react";
import { DAOConfigForm } from "@dorgtech/daocreator-lib";
import DAOConfigEditor from "components/commonV2/dao/DAOConfigEditor";
import { MDBBtn, MDBRow, MDBCol } from "mdbreact";

interface Props {
  form: DAOConfigForm;
  toReviewStep: () => void;
  toggleCollapse: () => void;
}

function NamingStep(props: Props) {
  const { form, toggleCollapse } = props;
  return (
    <>
      <div style={styles.paddingTotal}>
        <br />
        <DAOConfigEditor form={form} editable={true} />
        <br />
        <MDBRow style={styles.paddingBottom}>
          <MDBCol>
            <MDBBtn
              color="blue darken-4"
              size="sm"
              name="decisonSpeed"
              value="slow"
              style={styles.buttonStyle}
              onClick={() => toggleCollapse()}
            >
              Set Description
            </MDBBtn>
          </MDBCol>
        </MDBRow>
      </div>
    </>
  );
}

const styles = {
  buttonStyle: {
    borderRadius: "0.37rem",
    height: "45px",
    fontWeight: 300,
    backgroundColor: "#1976d2",
    color: "white",
    width: "145px",
    padding: "7px",
    marginBottom: "11px"
  },
  paddingBottom: {
    paddingBottom: "2%"
  },
  paddingTotal: {
    padding: "6px"
  }
};

export default NamingStep;
