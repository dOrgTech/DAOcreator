import * as React from "react";
import {
  DAOForm,
  toDAOMigrationParams,
  toJSON
} from "@dorgtech/daocreator-lib";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBContainer,
  MDBRow
} from "mdbreact";

import {
  DAOConfigForm,
  MembersForm,
  SchemesForm,
  fromDAOMigrationParams,
  fromJSON
} from "@dorgtech/daocreator-lib";

import NamingStep from "./NamingStep";
import MembersStep from "./MembersStep";
import SchemesStep from "./SchemesStep";
import InstallStep from "./InstallStep";
import Accordion from "components/commonV2/Accordion";

const DAO_CREATOR_STATE = "DAO_CREATOR_SETUP";

interface DAO_CREATOR_INTERFACE {
  step: number;
  form: string;
}

interface Step {
  title: string;
  form?: DAOForm | DAOConfigForm | MembersForm | SchemesForm;
  Component: any;
  callbacks?: Object;
}

export default function DAOcreator() {
  const daoForm = new DAOForm();

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
        <InstallStep form={recoveredForm} />
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

  let currentForm = daoForm.$.config;
  const nextStep = async () => {
    if (currentForm) {
      const res = await currentForm.validate();
      // if (!res.hasError) {
      setStep(step + 1);
      // }
    } else {
      setStep(step + 1);
    }
  };

  const steps: Step[] = [
    {
      title: "Set Description",
      form: daoForm.$.config,
      Component: NamingStep,
      callbacks: {
        toReviewStep: setStep,
        toggleCollapse: nextStep,
        setStep
      }
    },
    {
      title: "Configure Schemes",
      form: daoForm.$.schemes,
      Component: SchemesStep,
      callbacks: {
        toggleCollapse: nextStep,
        setStep
      }
    },
    {
      title: "Add Members",
      form: daoForm.$.members,
      Component: MembersStep,
      callbacks: {
        getDAOTokenSymbol: () => daoForm.$.config.$.tokenSymbol.value,
        toggleCollapse: nextStep,
        setStep
      }
    },
    {
      title: "Install Organization",
      form: daoForm,
      Component: InstallStep
    }
  ];

  return (
    <>
      <MDBContainer style={styles.paddingContainer}>
        <div style={styles.root}>
          <MDBRow style={styles.headerTop}></MDBRow>
          <div
            className="row justify-content-center"
            style={styles.titleContainer}
          >
            <h3 style={styles.fontStyle}>Create Organization</h3>
          </div>
          <div className="row">
            <div className="col-md-12">
              <ul className="stepper stepper-vertical" style={styles.noPadding}>
                {steps.map((actualStep: Step, index: number) => {
                  let { form, title, Component, callbacks } = actualStep;
                  return (
                    <Accordion
                      key={`step${index}`}
                      form={form}
                      title={title}
                      step={step}
                      index={index}
                      Component={Component}
                      callbacks={callbacks}
                    />
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </MDBContainer>
      <PreviewDialog />
    </>
  );
}

const styles = {
  root: {
    fontFamily: "Roboto",
    maxWidth: 734,
    border: "1px solid #EAEDF3",
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.04)",
    borderRadius: 4,
    margin: "auto"
  },
  paddingContainer: {
    padding: "1%",
    height: "50px"
  },
  fontStyle: {
    fontize: "1.45rem",
    fontWeight: 400,
    fontFamily: "inherit"
  },
  noPadding: {
    paddingTop: 0
  },
  headerTop: {
    height: "30px"
  },
  titleContainer: {
    paddingBottom: "13px",
    borderBottom: "1px solid",
    borderColor: "inherit",
    marginRight: 0,
    marginLeft: 0
  }
};
