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
  MDBRow,
  MDBCollapse,
  MDBIcon
} from "mdbreact";

import { Box } from "@chakra-ui/core";
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
import Accordion from "../commonv2/dao/Accordion";

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

  const recoveredForm = new DAOForm();
  daoForm.$.config.$.tokenName.$ = "test";
  daoForm.$.config.$.tokenName.value = "test";

  const [step, setStep] = React.useState<number>(0);
  const [collapseID, setCollapseID] = React.useState<any>("stepOne");
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

  const currentForm = steps[step].form;
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

  return (
    <>
      <MDBContainer style={styles.paddingContainer}>
        <Box style={styles.root}>
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
                <li className={step === 0 || step > 0 ? "completed" : ""}>
                  <MDBRow
                    style={styles.specialRow}
                    className="justify-content-space-between"
                  >
                    <a role="button">
                      <span
                        className="circle"
                        style={
                          step > 0 ? styles.completedStep : styles.completedStep
                        }
                      >
                        1
                      </span>
                      <span
                        className="label"
                        style={
                          step === 0 ? styles.active : styles.noActiveLabel
                        }
                      >
                        Set Description
                      </span>
                    </a>
                    <a>
                      <MDBBtn
                        hidden={step === 0}
                        floating
                        size="lg"
                        color="transparent"
                        className="btn"
                        onClick={() => setStep(0)}
                        style={styles.icon}
                      >
                        <MDBIcon icon="pen" className="blue-text"></MDBIcon>
                      </MDBBtn>
                    </a>
                  </MDBRow>

                  <MDBCollapse id="0" isOpen={step.toString()}>
                    <MDBRow
                      className="justify-content-end"
                      style={styles.stepContent}
                    >
                      <NamingStep
                        form={daoForm.$.config}
                        toReviewStep={() => {
                          setStep(3);
                        }}
                        toggleCollapse={nextStep}
                      />
                    </MDBRow>
                  </MDBCollapse>
                </li>

                <li className={step === 1 || step > 1 ? "completed" : ""}>
                  <MDBRow
                    style={styles.specialRow}
                    className="justify-content-space-between"
                  >
                    <a role="button">
                      <span
                        className="circle"
                        style={
                          step === 1 || step > 1
                            ? styles.circleActive
                            : styles.noActive
                        }
                      >
                        2
                      </span>
                      <span
                        className="label"
                        style={
                          step === 1 ? styles.active : styles.noActiveLabel
                        }
                      >
                        Configure Organization
                      </span>
                    </a>
                    <a>
                      <MDBBtn
                        hidden={step === 1 || step < 1}
                        floating
                        size="lg"
                        color="transparent"
                        className="btn"
                        onClick={() => setStep(1)}
                        style={styles.icon}
                      >
                        <MDBIcon icon="pen" className="blue-text"></MDBIcon>
                      </MDBBtn>
                    </a>
                  </MDBRow>
                  <MDBCollapse id="1" isOpen={step.toString()}>
                    <MDBRow
                      className="justify-content-end"
                      style={styles.stepContent}
                    >
                      <SchemesStep
                        form={daoForm.$.schemes}
                        toggleCollapse={nextStep}
                      />
                    </MDBRow>
                  </MDBCollapse>
                </li>

                <li className={step === 2 || step > 2 ? "completed" : ""}>
                  <MDBRow
                    style={styles.specialRow}
                    className="justify-content-space-between"
                  >
                    <a role="button">
                      <span
                        className="circle"
                        style={
                          step === 2 || step > 2
                            ? styles.circleActive
                            : styles.noActive
                        }
                      >
                        3
                      </span>
                      <span
                        className="label"
                        style={
                          step === 2 ? styles.active : styles.noActiveLabel
                        }
                      >
                        Add Members
                      </span>
                    </a>
                    <a>
                      <MDBBtn
                        hidden={step === 2 || step < 2}
                        floating
                        size="lg"
                        color="transparent"
                        className="btn"
                        onClick={() => setStep(2)}
                        style={styles.icon}
                      >
                        <MDBIcon icon="pen" className="blue-text"></MDBIcon>
                      </MDBBtn>
                    </a>
                  </MDBRow>
                  <MDBCollapse id="2" isOpen={step.toString()}>
                    <MDBRow
                      className="justify-content-end"
                      style={styles.stepContent}
                    >
                      <MembersStep
                        form={daoForm.$.members}
                        getDAOTokenSymbol={(): any =>
                          daoForm.$.config.$.tokenSymbol.value
                        }
                        toggleCollapse={nextStep}
                      />
                    </MDBRow>
                  </MDBCollapse>
                </li>

                <li className={step === 3 ? "completed" : ""}>
                  <a role="button">
                    <span
                      className="circle"
                      style={
                        step === 3 || step > 3
                          ? styles.circleActive
                          : styles.noActive
                      }
                    >
                      4
                    </span>
                    <span
                      className="label"
                      style={step === 3 ? styles.active : styles.noActiveLabel}
                    >
                      {" "}
                      Install Organization
                    </span>
                  </a>
                  <MDBCollapse id="3" isOpen={step.toString()}>
                    <MDBRow
                      className="justify-content-end"
                      style={styles.stepContent}
                    >
                      <InstallStep daoForm={daoForm} />
                    </MDBRow>
                  </MDBCollapse>
                </li>
              </ul>
            </div>
          </div>
        </Box>
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
  header: {
    paddingLeft: "36.5%"
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
  stepContent: {
    width: "100%",
    padding: "6px",
    margin: "0px 0px 0px 14%",
    border: "1px solid lightgray",
    borderRadius: "6px"
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
  },
  active: {
    fontWeight: 400,
    color: "#4285f4"
  },
  noActive: {
    color: "gray",
    backgroundColor: "white",
    borderColor: "white",
    border: "0.9px solid lightgray",
    fontWeight: 500
  },
  noActiveLabel: {
    color: "gray",
    fontWeight: 400
  },
  circleActive: {
    fontWeight: 400,
    backgroundColor: "rgb(66, 133, 244) !important",
    color: "white",
    borderColor: "white",
    border: "0.9px solid lightgray",
    background: "rgb(66, 133, 244) !important"
  },
  specialRow: {
    marginLeft: 0,
    marginRight: 0,
    width: "100%",
    justifyContent: "space-between"
  },
  icon: {
    background: "white",
    boxShadow: "none",
    color: "blue !important",
    padding: 5,
    height: 40,
    width: 40, //The Width must be the same as the height
    borderRadius: 400,
    border: "1px solid lightgrey"
  },
  completedStep: {
    fontWeight: 400,
    color: "#4285f4 !important",
    border: "0.9px solid #4285f4 !important",
    background: "white !important"
  }
};
