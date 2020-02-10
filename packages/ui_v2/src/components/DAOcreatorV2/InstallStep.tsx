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

  const onComplete = ({
    arcVersion,
    name,
    Avatar,
    DAOToken,
    Reputation,
    Controller
  }: DAOMigrationResult) => {
    console.log("onComplete");
    console.log(arcVersion);
    console.log(name);
    console.log(Avatar);
    console.log(DAOToken);
    console.log(Reputation);
    console.log(Controller);
    onStop();
  };

  const onStart = () => {
    // console.log("onStart");
  };

  const onAbort = (error: string) => {
    console.log("onAbort");
    console.log(error);
    onStop();
  };

  const onStop = () => {
    // console.log("onStop");
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
        onComplete={onComplete}
        onStart={onStart}
        onAbort={onAbort}
        onStop={onStop}
      />
    </Fragment>
  );
};

export default InstallStep;
