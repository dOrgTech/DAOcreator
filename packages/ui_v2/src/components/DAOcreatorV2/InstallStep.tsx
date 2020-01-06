import React from "react";
import Migrator from "../commonV2/dao/Migrator";
import {
  DAOForm,
  DAOMigrationResult,
  toDAOMigrationParams
} from "@dorgtech/daocreator-lib";
import { MDBBox } from "mdbreact";

interface Props {
  form: DAOForm;
}

/*
  Type issue for form.$

  Argument of type '{ config: DAOConfigForm; members: MembersForm; schemes: SchemesForm; }' is not assignable to parameter of type 'DAOcreatorState'.
    Types of property 'config' are incompatible.
      Type 'DAOConfigForm' is missing the following properties from type 'DAOConfig': daoName, tokenName, tokenSymbol
*/
function InstallStep(props: any) {
  const { form } = props;
  console.log(form.$);

  const onComplete = () => {
    console.log("onComplete");
    // Previously set daoCreator state:
    // isMigrating = false
  };

  const onStart = () => {
    console.log("onStart");
    // Previously set daoCreator state:
    // isMigrating = true
  };

  const onAbort = (error: Error) => {
    console.log(error.message);
    onStop();
  };

  const onStop = () => {
    console.log("onStop");
    // Previously set daoCreator state:
    // isMigrating = false
  };

  return (
    <MDBBox>
      <Migrator
        dao={toDAOMigrationParams(form.$)}
        onComplete={(result: DAOMigrationResult) => {
          console.log(result);
          onComplete();
        }}
        onStart={onStart}
        onAbort={onAbort}
        onStop={onStop}
      />
    </MDBBox>
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

const styles = {};

export default InstallStep;
