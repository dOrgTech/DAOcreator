import React, { FC } from "react";
import Migrator from "../commonV2/dao/Migrator";
import {
  DAOForm,
  DAOMigrationResult,
  toDAOMigrationParams,
  DAOMigrationParams
} from "@dorgtech/daocreator-lib";

interface Props {
  form: DAOForm;
}

const InstallStep: FC<Props> = ({ form }: Props) => {
  /*
   * Callbacks
   */

  const onComplete = () => {
    console.log("onComplete");
    onStop();
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

  const dao: DAOMigrationParams = toDAOMigrationParams(form.toState());
  return (
    <Migrator
      dao={dao}
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
