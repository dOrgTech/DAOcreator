import React from "react";
import { DAOConfigForm } from "@dorgtech/daocreator-lib";
import { AccordionSection } from "react-rainbow-components";
import DAOConfigEditor from "components/commonV2/dao/DAOConfigEditor";
import { MDBBtn, MDBContainer, MDBRow, MDBCol } from "mdbreact";

// eslint-disable-next-line
interface Props {
  form: DAOConfigForm;
  toReviewStep: () => void;
  nextStep: () => void;
}

function NamingStep(props: Props) {
  const { form, nextStep } = props;
  return (
    <>
      <AccordionSection
        name="0"
        label={true ? "1 Set Description" : "1 Description"}
      >
        <MDBContainer>
          <DAOConfigEditor form={form} editable={true} />
          <MDBRow>
            <MDBCol>
              <MDBBtn
                color="blue darken-4"
                size="sm"
                name="decisonSpeed"
                value="slow"
                style={styles.setDescriptionButton}
                onClick={() => nextStep()}
              >
                Set Description
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </AccordionSection>
    </>
  );
}

const styles = {
  setDescriptionButton: {
    borderRadius: "0.37rem",
    fontWeight: 700
  }
};

export default NamingStep;
