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

  const onAbort = (error: string) => {
    console.log("onAbort");
    console.log(error);
    onStop();
  };

  const onStop = () => {
    console.log("onStop");
    // Previously set daoCreator state:
    // isMigrating = false
  };

  const dao: DAOMigrationParams = toDAOMigrationParams(form.toState());

  // FOR TEST ONLY
  const printDAO = () => {
    console.log("form", form);
    console.log("form.$.schemes.$[0]", form.$.schemes.$[0]);
    console.log("form.$.schemes.$[1]", form.$.schemes.$[1]);
    console.log("form.toState()", form.toState());
    console.log("dao in install", dao);
  };
  return (
    <>
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
      {/*FOR TEST ONLY*/}
      <button onClick={() => printDAO()}>Print DAO</button>
    </>
  );
};

export default InstallStep;
