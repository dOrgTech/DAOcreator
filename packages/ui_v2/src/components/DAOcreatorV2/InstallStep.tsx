import React, { FC, Fragment } from "react";
import Migrator from "../commonV2/dao/Migrator";
import {
  DAOForm,
  DAOMigrationResult,
  toDAOMigrationParams,
  DAOMigrationParams
} from "@dorgtech/daocreator-lib";
import { MDBAlert, MDBIcon, MDBContainer } from "mdbreact";

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
  return (
    <Fragment>
      <MDBContainer>
        <MDBAlert color="danger" dismiss>
          <MDBIcon className="red-text mr-2" icon="exclamation-triangle" />
          Attempting to speed up transactions will BREAK deployment!
        </MDBAlert>
      </MDBContainer>
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
    </Fragment>
  );
};

export default InstallStep;
