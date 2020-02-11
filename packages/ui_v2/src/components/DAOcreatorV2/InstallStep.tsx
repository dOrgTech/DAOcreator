import React, { FC, Fragment, useState } from "react";
import Migrator from "../commonV2/dao/Migrator";
import {
  DAOForm,
  DAOMigrationResult,
  toDAOMigrationParams,
  DAOMigrationParams
} from "@dorgtech/daocreator-lib";
import { MDBAlert, MDBIcon, MDBContainer, MDBTooltip } from "mdbreact";

interface Props {
  form: DAOForm;
}

const InstallStep: FC<Props> = ({ form }: Props) => {
  const [alchemyAdds, setAlchemyAdds] = useState<string[]>([]);
  // Could be used to display the dao information to the user
  const [daoInfo, setDaoInfo] = useState<DAOMigrationResult[]>([]);

  /*
   * Callbacks
   */

  const onComplete = (
    {
      arcVersion,
      name,
      Avatar,
      DAOToken,
      Reputation,
      Controller
    }: DAOMigrationResult,
    alchemyURL: string
  ) => {
    setDaoInfo([
      ...daoInfo,
      { arcVersion, name, Avatar, DAOToken, Reputation, Controller }
    ]);
    setAlchemyAdds([...alchemyAdds, alchemyURL]);
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
                {" Alchemy URL "}
              </div>
              <div>Click to copy</div>
            </MDBTooltip>
            to avoid losing access to it
          </MDBAlert>
        ))}
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
