import React, { Fragment } from "react";
import { MDBBtn, MDBRow } from "mdbreact";
import { observer } from "mobx-react";

enum STEP {
  Waiting,
  Creating,
  Configuring,
  Completed
}

interface DeployProps {
  disabled?: boolean;
  dao?: any;
  step?: number;
  failed?: boolean | null;
}

function Deploy({ step, failed }: DeployProps) {
  const startInstallation = () => {};

  const openAlchemy = () => {};

  return (
    <div className="row justify-content-center">
      <MDBRow center>
        {step !== STEP.Completed ? (
          <MDBBtn
            disabled={(step !== STEP.Waiting && failed === null) || false}
            onClick={() => startInstallation()}
          >
            {/*failed === null ? "Install Organisation" : `Restart Installation ${step}`*/}
            Install Organization
          </MDBBtn>
        ) : (
          <Fragment>
            <MDBBtn onClick={() => openAlchemy()}>Open Alchemy</MDBBtn>
            <MDBBtn onClick={() => startInstallation()}>Redeploy</MDBBtn>
          </Fragment>
        )}
      </MDBRow>
    </div>
  );
}

export default observer(Deploy);
