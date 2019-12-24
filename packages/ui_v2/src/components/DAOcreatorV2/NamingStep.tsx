import React from "react";
import { DAOConfigForm } from "@dorgtech/daocreator-lib";
import DAOConfigEditor from "components/commonV2/dao/DAOConfigEditor";
import { MDBBtn, MDBContainer, MDBRow, MDBCol } from "mdbreact";

interface Props {
  form: DAOConfigForm;
  toReviewStep: () => void;
  nextStep: () => void;
}

function NamingStep(props: Props) {
  const { form, nextStep } = props;
  return (
    <>
      <MDBContainer>
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
              onClick={() => nextStep()}
            >
              Set Description
            </MDBBtn>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
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
  }
};

export default NamingStep;
