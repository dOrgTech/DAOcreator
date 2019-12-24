import * as React from "react";
import {
  DAOForm,
  toDAOMigrationParams,
  // fromDAOMigrationParams,
  toJSON,
  ContributionRewardForm,
  SchemeRegistrarForm
  // fromJSON
} from "@dorgtech/daocreator-lib";
import { Accordion } from "react-rainbow-components";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter
} from "mdbreact";

import { Box } from "@chakra-ui/core";
import {
  DAOForm,
  DAOConfigForm,
  MembersForm,
  SchemesForm,
  toDAOMigrationParams,
  fromDAOMigrationParams,
  toJSON,
  fromJSON
} from "@dorgtech/daocreator-lib";

import NamingStep from "./NamingStep";
import MembersStep from "./MembersStep";
import SchemesStep from "./SchemesStep";
import InstallStep from "./InstallStep";

const DAO_CREATOR_STATE = "DAO_CREATOR_SETUP";

interface DAO_CREATOR_INTERFACE {
  step: number;
  form: string;
}

interface Step {
  title: string;
  form?: DAOForm | DAOConfigForm | MembersForm | SchemesForm;
}

export default function DAOcreator() {
  const daoForm = new DAOForm();
  daoForm.$.schemes.$.push(
    new ContributionRewardForm(),
    new SchemeRegistrarForm()
  );


  const recoveredForm = new DAOForm();
  daoForm.$.config.$.tokenName.$ = "test";
  daoForm.$.config.$.tokenName.value = "test";
    
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

  const loadLocalStorage = () => {
    const daoCreatorState = localStorage.getItem(DAO_CREATOR_STATE);

    if (!daoCreatorState) {
      return;
    }

    const { step, form } = JSON.parse(daoCreatorState) as DAO_CREATOR_INTERFACE;
    const daoParams = fromJSON(form);
    const daoState = fromDAOMigrationParams(daoParams);
    daoForm.fromState(daoState);
    setStep(step);
    setRecoverPreviewOpen(false);
  };

  const resetLocalStorage = () => {
    localStorage.removeItem(DAO_CREATOR_STATE);
    setStep(0);
    setRecoverPreviewOpen(false);
  };

  const PreviewDialog = () => (
    <MDBModal open={recoverPreviewOpen} fullWidth={true} maxWidth="md">
      <MDBModalHeader id="simple-dialog-title">
        In Progress DAO Detected
      </MDBModalHeader>
      <MDBModalBody>
        <InstallStep daoForm={recoveredForm} />
      </MDBModalBody>
      <MDBModalFooter></MDBModalFooter>

      <MDBBtn
        onClick={loadLocalStorage}
        color={"primary"}
        variant={"contained"}
      >
        Resume
      </MDBBtn>
      <MDBBtn
        onClick={resetLocalStorage}
        color={"primary"}
        variant={"contained"}
      >
        Start Over
      </MDBBtn>
    </MDBModal>
  );

  const steps: Step[] = [
    {
      title: "Config",
      form: daoForm.$.config
    },
    {
      title: "Schemes",
      form: daoForm.$.schemes
    },
    {
      title: "Members",
      form: daoForm.$.members
    },
    {
      title: "Deploy",
      form: daoForm
    }
  ];

  /* when good looking UI is attached this is going to be 
  const currentForm = steps[1].form
  instead of a static number */

  const currentForm = steps[2].form;
  const nextStep = async () => {
    if (currentForm) {
      const res = await currentForm.validate();
      if (!res.hasError) {
        // setStep(step + 1);
      }
    } else {
      // setStep(step + 1);
    }
  };

  return (
    <Box style={styles.root}>
      <h3 style={styles.header}>Create Organization</h3>
      <Accordion id="accordion" activeSectionNames={step.toString()}>
        <NamingStep
          form={daoForm.$.config}
          toReviewStep={() => {
            setStep(3);
          }}
          nextStep={nextStep}
        />
        <SchemesStep form={daoForm.$.schemes} nextStep={nextStep} />
        <MembersStep
          form={daoForm.$.members}
          getDAOTokenSymbol={(): any => daoForm.$.config.$.tokenSymbol.value}
          nextStep={nextStep}
        />
        <InstallStep daoForm={daoForm} />
      </Accordion>
      <PreviewDialog />
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
