import * as React from "react";
import { DAOForm } from "@dorgtech/daocreator-lib";
interface Props {
  form: DAOForm;
}

function InstallStep(props: Props) {
  const printDAOForm = () => console.log("this.props.daoForm", props.form);
  return (
    <>
      <button
        style={styles.setDescriptionButton}
        onClick={() => printDAOForm()}
      >
        Print Form
      </button>
    </>
  );
}
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
  }
};

export default InstallStep;
