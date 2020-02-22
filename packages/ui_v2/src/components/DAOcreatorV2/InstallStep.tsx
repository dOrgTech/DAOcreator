import React, { FC, Fragment, useState } from "react";
import Migrator from "../commonV2/dao/Migrator";
import {
  DAOForm,
  DAOMigrationResult,
  toDAOMigrationParams
} from "@dorgtech/daocreator-lib";
import { MDBAlert, MDBIcon, MDBContainer, MDBTooltip } from "mdbreact";

interface Props {
  form: DAOForm;
  setLaunching: (launching: boolean) => void;
}

const InstallStep: FC<Props> = ({ form, setLaunching }: Props) => {
  const [alchemyAdds, setAlchemyAdds] = useState<string[]>([]);
  const [daoInfo, setDaoInfo] = useState<DAOMigrationResult[]>([]);
  const [daoLogs, setDaoLogs] = useState<string[][]>([]);

  /*
   * Methods
   */

  const addLog = (log: string) => {
    setDaoLogs(daoLogs => {
      daoLogs[daoLogs.length - 1].push(log);
      return daoLogs;
    });
  };

  const addNewLogs = () => {
    setDaoLogs(daoLogs => [...daoLogs, []]);
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

    // addLog("Completing Launch...");
    onStop();
  };

  const onStart = () => {
    setLaunching(true);

    addNewLogs();
  };

  const onAbort = (error: string) => {
    console.log("onAbort");
    console.log(error);
    onStop();
  };

  const onStop = () => {
    setLaunching(false);
    // addLog("Stopping Launch...");
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
      <div
        style={{
          marginTop: "-1.5rem",
          marginLeft: "auto",
          height: 0,
          fontSize: "75%"
        }}
      >
        {daoInfo.length > 0 && (
          <button
            style={styles.copyButton}
            onClick={() => copyDAO(daoInfo[daoInfo.length - 1])}
          >
            Copy Addresses
          </button>
        )}
        {daoLogs.length > 0 && (
          <button
            style={styles.copyButton}
            onClick={() => copyDAOLogs(daoLogs[daoLogs.length - 1])}
          >
            Copy Logs
          </button>
        )}
      </div>
    </Fragment>
  );
};

const styles = {
  copyButton: {
    margin: "0.2rem"
  }
};

export default InstallStep;
