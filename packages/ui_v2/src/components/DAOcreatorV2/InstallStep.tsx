import React, { FC } from "react";
import Migrator from "../commonV2/dao/Migrator";
import {
  DAOForm,
  DAOMigrationResult,
  toDAOMigrationParams
} from "@dorgtech/daocreator-lib";
import { MDBBox } from "mdbreact";

interface Props {
  form: any; //DAOForm;
}

/*
  Type issue for form.$

  Argument of type '{ config: DAOConfigForm; members: MembersForm; schemes: SchemesForm; }' is not assignable to parameter of type 'DAOcreatorState'.
    Types of property 'config' are incompatible.
      Type 'DAOConfigForm' is missing the following properties from type 'DAOConfig': daoName, tokenName, tokenSymbol
*/
const InstallStep: FC<Props> = ({ form }: Props) => {
  /*
   * Callbacks
   */

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
    console.log("onAbort");
    console.log(error.message);
    onStop();
  };

  const onStop = () => {
    console.log("onStop");
    // Previously set daoCreator state:
    // isMigrating = false
  };

  return (
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
  );
};

export default InstallStep;
