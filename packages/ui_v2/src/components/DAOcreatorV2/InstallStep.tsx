import React, { FC, Fragment, useState } from "react";
import Migrator from "../commonV2/dao/Migrator";
import {
  DAOForm,
  DAOMigrationResult,
  toDAOMigrationParams
} from "@dorgtech/daocreator-lib";
import {
  MDBAlert,
  MDBBtn,
  MDBIcon,
  MDBContainer,
  MDBTooltip
} from "mdbreact";
import FileSaver from "file-saver";

interface Props {
  form: DAOForm;
  setLaunching: (launching: boolean) => void;
}

const InstallStep: FC<Props> = ({ form, setLaunching }) => {
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
  };

  const onLog = (log: string) => {
    addLog(log);
  };

  /*
   * Methods
   */

  interface addresses {
    Avatar: string;
    DAOToken: string;
    Reputation: string;
    Controller: string;
  }

  const exportAddresses = (addresses: addresses) => {
    const blob = new Blob([JSON.stringify(addresses, null, 2)], {
      type: "text/plain;charset=utf-8"
    });
    FileSaver.saveAs(blob, "migration-addresses.json");
  };

  const saveAddresses = () => {
    if (!daoInfo[daoInfo.length - 1]) return;

    const { Avatar, DAOToken, Reputation, Controller } = daoInfo[
      daoInfo.length - 1
    ];

    exportAddresses({ Avatar, DAOToken, Reputation, Controller });
  };

  const copyDAOLogs = (logs: string[]) => {
    console.log(JSON.stringify(JSON.stringify(logs, null, 2)));
    navigator.clipboard.writeText(JSON.stringify(logs, null, 2));
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
        saveAddresses={saveAddresses}
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
        {daoLogs.length > 0 && (
          <MDBContainer>
            <MDBTooltip placement="top" domElement>
              <div>
                <MDBIcon
                  className="blue-text"
                  size="lg"
                  icon="copy"
                  style={{ cursor: "pointer" }}
                  onClick={() => copyDAOLogs(daoLogs[daoLogs.length - 1])}
                />
              </div>
              <div>Click to copy logs</div>
            </MDBTooltip>
          </MDBContainer>
        )}
      </div>
    </Fragment>
  );
};

export default InstallStep;
