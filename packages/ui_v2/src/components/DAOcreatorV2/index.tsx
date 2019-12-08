import * as React from "react";
import {
  DAOForm,
  toDAOMigrationParams,
  fromDAOMigrationParams,
  toJSON,
  fromJSON
} from "@dorgtech/daocreator-lib";
import { Accordion } from "react-rainbow-components";
import { Box } from "@chakra-ui/core";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

import NamingStep from "./NamingStep";
import MembersStep from "./MembersStep";
import SchemesStep from "./SchemesStep";
import InstallStep from "./InstallStep";

const DAO_CREATOR_STATE = "DAO_CREATOR_SETUP";
interface DAO_CREATOR_INTERFACE {
  step: number;
  form: string;
}

export default function DAOcreator() {
  const daoForm = new DAOForm();
  const recoveredForm = new DAOForm();

  const [step, setStep] = React.useState<number>(0);

  const [recoverPreviewOpen, setRecoverPreviewOpen] = React.useState<boolean>(
    false
  );

  React.useEffect(() => {
    previewLocalStorage();
    window.addEventListener("beforeunload", saveLocalStorage);

    return () => {
      window.removeEventListener("beforeunload", saveLocalStorage);
    };
  });

  const saveLocalStorage = () => {
    const daoState = daoForm.toState();

    // Check to see if the current form state hasn't been edited,
    // and if so early out so we don't save an empty state
    const nullForm = new DAOForm();
    if (JSON.stringify(daoState) === JSON.stringify(nullForm.toState())) {
      return;
    }

    const daoParams = toDAOMigrationParams(daoState);
    const json = toJSON(daoParams);
    const daoCreatorState: DAO_CREATOR_INTERFACE = {
      step,
      form: json
    };

    localStorage.setItem(DAO_CREATOR_STATE, JSON.stringify(daoCreatorState));
  };

  const previewLocalStorage = () => {
    const daoCreatorState = localStorage.getItem(DAO_CREATOR_STATE);

    if (!daoCreatorState) {
      return;
    }
    const { form } = JSON.parse(daoCreatorState) as DAO_CREATOR_INTERFACE;
    const daoParams = fromJSON(form);
    const daoState = fromDAOMigrationParams(daoParams);
    recoveredForm.fromState(daoState);

    setRecoverPreviewOpen(true);
  };

  return (
    <Box style={styles.root}>
      <h3 style={styles.header}>Create Organisation</h3>
      <Accordion id="accordion">
        <NamingStep
          form={daoForm}
          daoForm={daoForm}
          toReviewStep={() => {
            setStep(3);
          }}
        />
        <SchemesStep form={daoForm.$.schemes} />
        <MembersStep
          form={daoForm.$.members}
          getDAOTokenSymbol={(): any => daoForm.$.config.$.tokenSymbol.value}
        />
        <InstallStep form={daoForm} daoForm={daoForm} />
      </Accordion>
    </Box>
  );
}

const styles = {
  root: {
    fontFamily: "Roboto",
    maxWidth: 734,
    border: "1px solid #EAEDF3",
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.04)",
    borderRadius: 4
  },
  header: {
    paddingLeft: "36.5%"
  }
};
