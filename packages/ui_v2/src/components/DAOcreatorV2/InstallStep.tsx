import React, { FC, Fragment, useState } from "react";
import Migrator from "../commonV2/dao/Migrator";
import {
  DAOForm,
  DAOMigrationResult,
  toDAOMigrationParams
} from "@dorgtech/daocreator-lib";
import { MDBAlert, MDBIcon, MDBContainer, MDBTooltip, MDBBtn } from "mdbreact";

interface Props {
  form: DAOForm;
  setLaunching: (launching: boolean) => void;
}

const InstallStep: FC<Props> = ({ form, setLaunching }: Props) => {
  const [alchemyAdds, setAlchemyAdds] = useState<string[]>([]);
  const [daoInfo, setDaoInfo] = useState<DAOMigrationResult[]>([]);
  const [daoLogs, setDaoLogs] = useState<string[][]>([[]]);

  /*
   * Methods
   */

  const addLog = (log: string) => {
    const newDaoLogs = daoLogs;
    daoLogs[daoLogs.length - 1].push(log);
    setDaoLogs(newDaoLogs);
  };

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

    addLog("Completing Launch...");
    setLaunching(false);
  };

  const onStart = () => {
    setLaunching(true);
    setDaoLogs([...daoLogs, ["Starting Launch..."]]);
  };

  const onAbort = (error: string) => {
    console.log("onAbort");
    console.log(error);
    onStop();
  };

  const onStop = () => {
    setLaunching(false);
    addLog("Stopping Launch...");
  };

  const onLog = (log: string) => {
    addLog(log);
  };

  /*
   * Methods
   */

  const copyDAO = (dao: DAOMigrationResult) => {
    console.log(dao);
    console.log(JSON.stringify(dao));
    navigator.clipboard.writeText(JSON.stringify(dao));
  };

  const copyDAOLogs = (logs: string[]) => {
    console.log(logs);
    console.log(JSON.stringify(logs));
    navigator.clipboard.writeText(JSON.stringify(logs));
  };

  return (
    <Fragment>
      <MDBContainer>
        <MDBAlert color="warning" dismiss>
          <MDBIcon className="red-text mr-2" icon="exclamation-triangle" />
          Attempting to speed up transactions will BREAK deployment!
        </MDBAlert>
        {alchemyAdds.map((address: string) => (
          <MDBAlert key={address} color="warning" dismiss>
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
      <Migrator
        dao={toDAOMigrationParams(form.toState())}
        onComplete={onComplete}
        onStart={onStart}
        onAbort={onAbort}
        onStop={onStop}
        onLog={onLog}
      />
      {daoInfo.map((dao: DAOMigrationResult, index: number) => (
        <MDBBtn key={index} onClick={() => copyDAO(dao)}>
          Copy DAO Addresses
        </MDBBtn>
      ))}
      {daoLogs.map((logs: string[], index: number) => (
        <MDBBtn key={index} onClick={() => copyDAOLogs(logs)}>
          Copy DAO Logs
        </MDBBtn>
      ))}
    </Fragment>
  );
};

export default InstallStep;
