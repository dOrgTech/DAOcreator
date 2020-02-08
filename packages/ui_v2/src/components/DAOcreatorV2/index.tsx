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
  MDBIcon,
  MDBPopover,
  MDBPopoverBody
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

import FileSaver from "file-saver";
import Stepper from "../commonV2/Stepper";
import { ImporterModal } from "../commonV2/Stepper/ImporterModal";
import { getProvider } from "../web3/core";

const DAO_CREATOR_STATE = "DAO_CREATOR_SETUP";

interface DAO_CREATOR_INTERFACE {
  step: number;
  form: string;
}

interface Step {
  title: string;
  form: DAOForm | DAOConfigForm | MembersForm | SchemesForm;
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
  const [loading, setLoading] = React.useState<boolean>(true);
  const [recoverPreviewOpen, setRecoverPreviewOpen] = React.useState<boolean>(
    false
  );
  const [advanceSchemeConfig, setAdvanceSchemeConfig] = React.useState<boolean>(
    false
  );
  const [importFile, setImportFile] = React.useState<string>("");

  let currentForm: any = daoForm.$.config;

  const nextStep = React.useCallback(async () => {
    const res = await currentForm.validate();
    if (!res.hasError) {
      setStep(step + 1);
    }
  }, [currentForm, step]);

  // On initial load
  React.useEffect(() => {
    if (!loading) return;

    const handleMetamask = async () => {
      try {
        const address = await getProvider();
        setDefaultAddress(address);

        // TODO Handle network change (Only Mainnet and Rinkeby are supported)
        (window as any).ethereum.autoRefreshOnNetworkChange = false;

        // Should be implemented by MetaMask soon-tm
        (window as any).ethereum.on("chainChanged", (chainId: number) => {
          // handle the new network
          console.log("Current chain: " + chainId);
          return null;
        });

        (window as any).ethereum.on("networkChanged", (networkId: string) => {
          // networkId goes from "loading" to the network id (different to chain id)
          console.log("Current chain: " + networkId);
          return null;
        });
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

    handleMetamask();
    previewLocalStorage();
  }, [loading]);

  // Save state every step
  React.useEffect(() => {
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

    window.addEventListener("beforeunload", saveLocalStorage);
    return () => {
      window.removeEventListener("beforeunload", saveLocalStorage);
    };
  }, [step]);

  React.useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key !== "Enter") return;
      switch (step) {
        case 2:
        case 3:
          break;
        default:
          nextStep();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [step, nextStep]);

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

  const exportDaoParams = () => {
    const dao = toDAOMigrationParams(daoForm.toState());
    const blob = new Blob([toJSON(dao)], {
      type: "text/plain;charset=utf-8"
    });
    FileSaver.saveAs(blob, "migration-params.json");
  };

  const PreviewDialog = () => (
    <MDBModal open={recoverPreviewOpen} fullWidth={true} maxWidth="md">
      <MDBModalHeader id="simple-dialog-title">
        In Progress DAO Detected
      </MDBModalHeader>
      <MDBModalBody>
        <InstallStep form={recoveredForm} />
      </MDBModalBody>
      <MDBModalFooter />

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
      title: "Configure",
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
        setModal: setImportFile,
        step
      }
    },
    {
      title: "Launch",
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
                <MDBPopover placement="bottom" popover clickable>
                  <MDBBtn
                    floating
                    size="lg"
                    color="transparent"
                    className="btn"
                    style={styles.icon}
                  >
                    <MDBIcon icon="ellipsis-v" className="blue-text" />{" "}
                  </MDBBtn>
                  <div style={styles.divided}>
                    <div // There might be a better MDBReact component for this
                      style={{ cursor: "pointer" }}
                      onClick={() => setImportFile("Import configuration")}
                    >
                      <MDBPopoverBody>Import Configuration</MDBPopoverBody>
                    </div>
                    <div style={styles.divider} />
                    <div // There might be a better MDBReact component for this
                      style={{ cursor: "pointer" }}
                      onClick={() => exportDaoParams()}
                    >
                      <MDBPopoverBody>Export Configuration</MDBPopoverBody>
                    </div>
                  </div>
                </MDBPopover>
              </div>
            </MDBCol>
          </MDBRow>
          <br />
          <div style={styles.divider} />
          <div className="row justify-content-center">
            <div className="col-md-12">
              {loading ? (
                <div style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                  <MDBRow className="justify-content-center">
                    <div className="spinner-border text-primary" />
                  </MDBRow>
                  <MDBRow className="justify-content-center">
                    <p style={styles.fontStyle}> Please allow metamask </p>
                  </MDBRow>
                </div>
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
      <ImporterModal
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
  },
  divided: {
    display: "flex",
    alignItems: "center"
  },
  divider: {
    flexGrow: 1,
    margin: "5px",
    border: "1px solid lightgrey"
  }
};
