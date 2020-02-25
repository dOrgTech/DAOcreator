import React, { FC, useState, useEffect } from "react";
import { DAOConfigForm } from "@dorgtech/daocreator-lib";
import DAOConfigEditor from "../commonV2/dao/DAOConfigEditor";
import { MDBRow, MDBCol } from "mdbreact";
import "./styles.css";

interface Props {
  form: DAOConfigForm;
  loadedFromModal: boolean;
  toggleCollapse: () => void;
}

export type NamingError = {
  daoName: boolean;
  tokenSymbol: boolean;
};

// Please refactor this
const NamingStep: FC<Props> = ({ form, loadedFromModal, toggleCollapse }) => {
  const [errors, setErrors] = useState<NamingError>({
    daoName: true,
    tokenSymbol: true
  });

  useEffect(() => {
    if (!loadedFromModal) return;

    setErrors({
      ...errors,
      daoName: form.$.daoName.hasError,
      tokenSymbol: form.$.tokenSymbol.hasError
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedFromModal]);

  useEffect(() => {
    form.$.tokenName.value = form.$.daoName.value + " token";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.$.daoName.$]);

  return (
    <div style={styles.paddingTotal}>
      <br />
      <DAOConfigEditor form={form} editable={true} namingError={errors} checkError={setErrors} />
      <br />
      <MDBRow style={styles.paddingBottom}>
        <MDBCol>
          <button
            id="setDescription"
            style={errors.daoName || errors.tokenSymbol ? styles.buttonDeactivatedStyle : styles.buttonActivatedStyle}
            disabled={errors.daoName || errors.tokenSymbol}
            onClick={toggleCollapse}
          >
            Set Description
          </button>
        </MDBCol>
      </MDBRow>
    </div>
  );
};

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
    paddingBottom: "0%"
  },
  paddingTotal: {
    padding: "0px"
  }
};

export default NamingStep;
