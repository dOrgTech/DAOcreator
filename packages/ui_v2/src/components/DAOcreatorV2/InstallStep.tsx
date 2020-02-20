import React, { FC, Fragment } from "react";
import Migrator from "../commonV2/dao/Migrator";
import { DAOForm } from "@dorgtech/daocreator-lib";
import { MDBAlert, MDBIcon, MDBContainer, MDBTooltip } from "mdbreact";

interface Props {
  form: DAOForm;
  setLaunching: (launching: boolean) => void;
  migrationStates: any;
}

const InstallStep: FC<Props> = ({ migrationStates }: Props) => {
  const { alchemyAdds, onComplete, onStart, onAbort, onStop } = migrationStates;
  return (
    <>
      <Fragment>
        <MDBContainer>
          <MDBAlert color="danger" dismiss>
            <MDBIcon className="red-text mr-2" icon="exclamation-triangle" />
            Attempting to speed up transactions will BREAK deployment!
          </MDBAlert>
          {alchemyAdds.map((address: string) => (
            <MDBAlert key={address} color="danger" dismiss>
              <MDBIcon className="red-text mr-2" icon="exclamation-triangle" />
              Save your new DAO's
              <MDBTooltip domElement>
                <div
                  onClick={() => {
                    navigator.clipboard.writeText(address);
                  }}
                  style={{
                    cursor: "pointer",
                    display: "inline-block",
                    color: "blue"
                  }}
                >
                  &nbsp;Alchemy URL&nbsp;
                </div>
                <div>Click to copy</div>
              </MDBTooltip>
              to avoid losing access to it
            </MDBAlert>
          ))}
        </MDBContainer>
      </Fragment>
      <Migrator
        dao={migrationStates.dao}
        onComplete={onComplete}
        onStart={onStart}
        onAbort={onAbort}
        onStop={onStop}
        migrationStates={migrationStates}
      />
    </>
  );
};

export default InstallStep;
