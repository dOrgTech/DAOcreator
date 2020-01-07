import * as React from "react";
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
  MDBCol,
  MDBIcon
} from "mdbreact";

import {
  DAOConfigForm,
  MembersForm,
  SchemesForm,
  fromDAOMigrationParams,
  fromJSON,
  DAOForm,
  toDAOMigrationParams,
  toJSON
} from "@dorgtech/daocreator-lib";

import NamingStep from "./NamingStep";
import MembersStep from "./MembersStep";
import SchemesStep from "./SchemesStep";
import InstallStep from "./InstallStep";
import Stepper from "components/commonV2/Stepper";
import { getProvider } from "web3/core";
import { ImportModal } from "../commonV2/Stepper/ImportModal";

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

const daoForm = new DAOForm();
const recoveredForm = new DAOForm();

export default function DAOcreator() {
  const [step, setStep] = React.useState<number>(0);
  const [defaultAddress, setDefaultAddress] = React.useState<
    string | undefined
  >();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [recoverPreviewOpen, setRecoverPreviewOpen] = React.useState<boolean>(
    false
  );
  const [advanceSchemeConfig, setAdvanceSchemeConfig] = React.useState<boolean>(
    false
  );
  const [importFile, setImportFile] = React.useState<string>("");

  const handleMetamask = async () => {
    try {
      const address = await getProvider();
      setDefaultAddress(address);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const previewLocalStorage = () => {
    const daoCreatorState = localStorage.getItem(DAO_CREATOR_STATE);

    if (!daoCreatorState) {
      setLoading(false);
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

  React.useEffect(() => {
    setLoading(true);
    handleMetamask();
    previewLocalStorage();
    window.addEventListener("beforeunload", saveLocalStorage);
    return () => {
      window.removeEventListener("beforeunload", saveLocalStorage);
    };
  }, []);

  const getDAOTokenSymbol = () => daoForm.$.config.$.tokenSymbol.value;

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

  let currentForm: any = daoForm.$.config;
  const nextStep = async () => {
    const res = await currentForm.validate();
    if (!res.hasError) {
      setStep(step + 1);
    }
  };

  const steps: Step[] = [
    {
      title: "Set Description",
      form: daoForm.$.config,
      Component: NamingStep,
      callbacks: {
        toggleCollapse: nextStep,
        setStep,
        daoName: () => daoForm.$.config.$.daoName.value
      }
    },
    {
      title: "Configure Schemes",
      form: daoForm.$.schemes,
      Component: SchemesStep,
      callbacks: {
        toggleCollapse: nextStep,
        setStep,
        modal: advanceSchemeConfig,
        setModal: setAdvanceSchemeConfig
      }
    },
    {
      title: "Add Members",
      form: daoForm.$.members,
      Component: MembersStep,
      callbacks: {
        getDAOTokenSymbol,
        toggleCollapse: nextStep,
        setStep,
        address: defaultAddress,
        step
      }
    },
    {
      title: "Install Organization",
      form: daoForm,
      Component: InstallStep
    }
  ];

  currentForm = steps[+step].form;
  return (
    <>
      <MDBContainer style={styles.paddingContainer}>
        <div style={styles.root}>
          <MDBRow style={styles.headerTop}>
            <MDBCol size="3" />
            <MDBCol size="6" style={styles.titleContainer}>
              <h3 style={styles.fontStyle}>Create Organization</h3>
            </MDBCol>
            <MDBCol size="3">
              <div>
                <MDBBtn
                  floating
                  size="lg"
                  color="transparent"
                  className="btn"
                  onClick={() => setImportFile("Import configuration")}
                  style={styles.icon}
                >
                  <MDBIcon icon="ellipsis-v" className="blue-text" />{" "}
                </MDBBtn>
              </div>
            </MDBCol>
          </MDBRow>
          <br />
          <hr />
          <div className="row">
            <div className="col-md-12">
              {loading ? (
                <>
                  <div
                    style={styles.spinner}
                    className="spinner-border text-primary"
                    role="status"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p style={styles.fontStyle}> Please allow metamask </p>
                </>
              ) : !defaultAddress ? (
                <div className="row justify-content-center">
                  <h4 style={styles.fontStyle}>
                    You must allow metamask to continue
                  </h4>
                </div>
              ) : (
                <ul
                  className="stepper stepper-vertical"
                  style={styles.noPadding}
                >
                  {steps.map((actualStep: Step, index: number) => {
                    let { form, title, Component, callbacks } = actualStep;
                    return (
                      <Stepper
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
              )}
            </div>
          </div>
        </div>
      </MDBContainer>
      <PreviewDialog />
      <ImportModal
        title={importFile}
        form={daoForm}
        reviewStep={setStep}
        setTitle={setImportFile}
      />
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
    height: "40px"
  },
  titleContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px"
  },
  spinner: {
    display: "inline-block"
  },
  icon: {
    background: "white",
    boxShadow: "none",
    color: "blue !important",
    padding: 5,
    marginLeft: "93px",
    marginTop: "18.5px",
    height: 35,
    width: 35, //The Width must be the same as the height
    borderRadius: 400,
    border: "1px solid lightgrey"
  }
};
