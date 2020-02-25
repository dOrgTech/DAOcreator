import React, { FC, useEffect } from "react";
import { DAOConfigForm } from "@dorgtech/daocreator-lib";
import { observer } from "mobx-react";
import DAOConfigEditor from "../commonV2/dao/DAOConfigEditor";
import { MDBRow, MDBCol } from "mdbreact";

interface Props {
  form: DAOConfigForm;
  toggleCollapse: () => void;
}

export type NamingError = {
  daoName: boolean;
  tokenSymbol: boolean;
};

// Please refactor this
const NamingStep: FC<Props> = observer(({ form, toggleCollapse }) => { 

  useEffect(() => {
    form.$.tokenName.value = form.$.daoName.value + " token";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.$.daoName.$]);

  return (
    <div style={styles.paddingTotal}>
      <br />
      <DAOConfigEditor
        form={form}
        editable={true}
      />
      <br />
      <MDBRow style={styles.paddingBottom}>
        <MDBCol>
          <button
            style={
              form.hasError
                ? styles.buttonDeactivatedStyle
                : styles.buttonActivatedStyle
            }
            disabled={form.hasError}
            onClick={toggleCollapse}
          >
            Set Description
          </button>
        </MDBCol>
      </MDBRow>
    </div>
  );
});

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
