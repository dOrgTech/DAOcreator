import * as React from "react";
import { DAOForm } from "@dorgtech/daocreator-lib";
interface Props {
  daoForm: DAOForm;
}

function InstallStep(props: Props) {
  const printDAOForm = () => console.log("this.props.daoForm", props.daoForm);
  return (
    <>
      <p onClick={() => printDAOForm()}>Print Form</p>
    </>
  );
}

export default InstallStep;
