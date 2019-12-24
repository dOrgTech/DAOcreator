import * as React from "react";
import {
  DAOForm,
  toDAOMigrationParams,
  // fromDAOMigrationParams,
  toJSON
  // fromJSON
} from "@dorgtech/daocreator-lib";
import { Accordion } from "react-rainbow-components";
import { Box } from "@chakra-ui/core";
import { MDBContainer, MDBRow } from "mdbreact";
import CustomStep from "components/commonV2/CustomStep";
import StepContainer from "components/commonV2/StepComponent";
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
  // const recoveredForm = new DAOForm();

  const [step, setStep] = React.useState<number>(0);
  // const [isMigrating, setIsMigrating] = React.useState<boolean>(false);

  // const [recoverPreviewOpen, setRecoverPreviewOpen] = React.useState<boolean>(
  //   false
  // );

  React.useEffect(() => {
    // previewLocalStorage();
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

  // const previewLocalStorage = () => {
  //   const daoCreatorState = localStorage.getItem(DAO_CREATOR_STATE);
  //
  //   if (!daoCreatorState) {
  //     return;
  //   }
  //   const { form } = JSON.parse(daoCreatorState) as DAO_CREATOR_INTERFACE;
  //   const daoParams = fromJSON(form);
  //   const daoState = fromDAOMigrationParams(daoParams);
  //   recoveredForm.fromState(daoState);
  //
  //   setRecoverPreviewOpen(true);
  // };

  // const resetLocalStorage = () => {
  //   localStorage.removeItem(DAO_CREATOR_STATE);
  //   setStep(0);
  //   setRecoverPreviewOpen(false);
  // };

  // const loadLocalStorage = () => {
  //   const daoCreatorState = localStorage.getItem(DAO_CREATOR_STATE);
  //
  //   if (!daoCreatorState) {
  //     return;
  //   }
  //
  //   const { step, form } = JSON.parse(daoCreatorState) as DAO_CREATOR_INTERFACE;
  //   const daoParams = fromJSON(form);
  //   const daoState = fromDAOMigrationParams(daoParams);
  //   daoForm.fromState(daoState);
  //
  //   setStep(step);
  //   setRecoverPreviewOpen(false);
  // };

  // const onClose = () => {
  //   setRecoverPreviewOpen(false);
  // };

  return (
    <MDBContainer style={styles.paddingContainer}>
      <Box style={styles.root}>
        <MDBRow style={styles.headerTop}></MDBRow>
        <div
          className="row justify-content-center"
          style={styles.titleContainer}
        >
          <h3 style={styles.fontStyle}>Create Organisation</h3>
        </div>
        <div className="row">
          <div className="col-md-12">
            <ul className="stepper stepper-vertical" style={styles.noPadding}>
              <li className="completed">
                <a role="button">
                  <span className="circle">1</span>
                  <span className="label" style={styles.active}>
                    Set Description
                  </span>
                </a>
                <MDBRow
                  className="justify-content-end"
                  style={styles.stepContent}
                >
                  <NamingStep
                    form={daoForm.$.config}
                    daoForm={daoForm}
                    toReviewStep={() => {
                      setStep(3);
                    }}
                  />
                </MDBRow>
              </li>

              <li>
                <a role="button">
                  <span className="circle" style={styles.noActive}>
                    2
                  </span>
                  <span className="label" style={styles.noActiveLabel}>
                    Configure Organization
                  </span>
                </a>
                <MDBRow
                  className="justify-content-end"
                  style={styles.stepContent}
                >
                  <SchemesStep form={daoForm.$.schemes} />
                </MDBRow>
              </li>

              <li>
                <a role="button">
                  <span className="circle" style={styles.noActive}>
                    3
                  </span>
                  <span className="label" style={styles.noActiveLabel}>
                    Add Members
                  </span>
                </a>
                <MDBRow
                  className="justify-content-end"
                  style={styles.stepContent}
                >
                  <MembersStep
                    form={daoForm.$.members}
                    getDAOTokenSymbol={(): any =>
                      daoForm.$.config.$.tokenSymbol.value
                    }
                  />
                </MDBRow>
              </li>

              <li>
                <a role="button">
                  <span className="circle" style={styles.noActive}>
                    4
                  </span>
                  <span className="label" style={styles.noActiveLabel}>
                    Install Organisation
                  </span>
                </a>
                <MDBRow
                  className="justify-content-end"
                  style={styles.stepContent}
                >
                  <InstallStep form={daoForm} daoForm={daoForm} />
                </MDBRow>
              </li>
            </ul>
          </div>
        </div>
      </Box>
    </MDBContainer>
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
    width: "80%",
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
  }
};
