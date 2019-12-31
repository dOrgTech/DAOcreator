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

// interface Props extends WithStyles<typeof styles> {
//   dao: DAOMigrationParams;
//   onComplete: (result: DAOMigrationResult) => void;
//   onAbort: (error: Error) => void;
//   onStart: () => void;
//   onStop: () => void;
// }

function InstallStep(props: any) {
  const { form } = props;

  const onComplete = () => {
    console.log("onComplete");
    // Update UI
  };
  const onStart = () => {
    console.log("onStart");
    // Update UI
  };
  const onAbort = (error: Error) => {
    console.log(error.message);
    onStop();
  };
  const onStop = () => {
    console.log("onStop");
    // Update UI
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

const styles = {};

export default InstallStep;
