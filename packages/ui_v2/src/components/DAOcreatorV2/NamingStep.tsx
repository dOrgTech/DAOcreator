import React from "react";
import { DAOConfigForm } from "@dorgtech/daocreator-lib";
import DAOConfigEditor from "../commonV2/dao/DAOConfigEditor";
import { MDBRow, MDBCol } from "mdbreact";

interface Props {
  form: DAOConfigForm;
  toggleCollapse: () => void;
}

function NamingStep(props: Props) {
  const { form, toggleCollapse } = props;
  const namingError = {
    daoName: true,
    daoSymbol: true
  };
  const [hasError, setHasError] = React.useState<any>(namingError);
  form.$.tokenName.$ = "0";
  form.$.tokenName.value = "0";

  return (
    <>
      <div style={styles.paddingTotal}>
        <br />
        <DAOConfigEditor
          form={form}
          editable={true}
          namingError={hasError}
          checkError={setHasError}
        />
        <br />
        <MDBRow style={styles.paddingBottom}>
          <MDBCol>
            <button
              name="decisonSpeed"
              value="slow"
              style={
                hasError.daoName || hasError.daoSymbol
                  ? styles.buttonDeactivatedStyle
                  : styles.buttonActivatedStyle
              }
              disabled={hasError.daoName || hasError.daoSymbol}
              onClick={toggleCollapse}
            >
              Set Description
            </button>
          </MDBCol>
        </MDBRow>
      </div>
    </>
  );
}

const styles = {
  buttonActivatedStyle: {
    borderRadius: "0.37rem",
    height: "45px",
    fontWeight: 300,
    backgroundColor: "#1976d2",
    color: "white",
    width: "145px",
    padding: "7px",
    marginBottom: "11px",
    fontSize: "smaller"
  },
  buttonDeactivatedStyle: {
    borderRadius: "0.37rem",
    height: "45px",
    fontWeight: 300,
    backgroundColor: "white",
    color: "#1976d2",
    width: "145px",
    padding: "7px",
    marginBottom: "11px",
    fontSize: "smaller"
  },
  paddingBottom: {
    paddingBottom: "2%"
  },
  paddingTotal: {
    padding: "6px"
  }
};

export default NamingStep;
