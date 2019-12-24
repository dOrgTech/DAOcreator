import * as React from "react";
import { DAOForm } from "@dorgtech/daocreator-lib";
import { AccordionSection } from "react-rainbow-components";
interface Props {
  daoForm: DAOForm;
}

function InstallStep(props: Props) {
  const printDAOForm = () => console.log("this.props.daoForm", props.daoForm);
  return (
    <>
      <AccordionSection name="3" label="4 Install Organisation">
        <p onClick={() => printDAOForm()}>Print Form</p>
      </AccordionSection>
    </>
  );
}

export default InstallStep;
