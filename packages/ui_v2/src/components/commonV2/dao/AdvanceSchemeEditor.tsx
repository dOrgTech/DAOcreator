import React, { Fragment, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBTooltip
} from "mdbreact";
import { observable, IObservableObject } from "mobx";
import {
  AnySchemeForm,
  GenericSchemeForm,
  ContributionRewardForm,
  SchemeRegistrarForm,
  SchemeType
} from "@dorgtech/daocreator-lib";
import GenesisProtocolEditor from "./GenesisProtocolEditor";

export interface Props {
  form: any;
  setAdvanceMode: any;
}

const schemeName = {
  0: "Contribution Reward",
  1: "Scheme Registrar",
  2: "Generic Scheme"
};

function AdvanceSchemeEditor(props: Props) {
  const { form, setAdvanceMode } = props;
  const [scheme, setScheme] = useState<number>(SchemeType.ContributionReward);
  const [schemeIsAdded, checkSchemeIsAdded] = useState<boolean>(false);

  const schemeEditorsMock: AnySchemeForm[] = [
    observable(new ContributionRewardForm()),
    observable(new SchemeRegistrarForm()),
    observable(new GenericSchemeForm())
  ];

  const handleToggle = (index: number) => {
    checkSchemeIsAdded(
      form.$.some((scheme: AnySchemeForm) => scheme.type === index)
    );
  };

  const showNewScheme = (schemeIndex: number) => {
    setScheme(schemeIndex);
    handleToggle(schemeIndex);
  };

  const selectedForm = form.$.filter(
    (x: AnySchemeForm) => x.type === scheme
  ).pop();

  const handleScheme = (schemeIndex: number) => {
    const added = form.$.length > 0 && schemeIsAdded;

    const removeScheme = () => {
      const filterSchemes = (x: AnySchemeForm) => {
        if (scheme !== x.type) return x;
      };
      const removeUndefined = (x: AnySchemeForm | undefined) => x;
      form.$ = form.$.map(filterSchemes).filter(removeUndefined);
    };

    const addScheme = (scheme: AnySchemeForm & IObservableObject) => {
      form.$.push(scheme);
    };

    if (added) {
      removeScheme();
    } else {
      switch (schemeIndex) {
        case 0:
          const constributionReward = observable(new ContributionRewardForm());
          addScheme(constributionReward);
          break;
        case 1:
          const schemeRegistrar = observable(new SchemeRegistrarForm());
          addScheme(schemeRegistrar);
          break;
        case 2:
          const genericScheme = observable(new GenericSchemeForm());
          addScheme(genericScheme);
          break;
      }
    }
    handleToggle(schemeIndex);
  };

  const [modalState, setModalState] = useState<boolean>(false);

  return (
    <Fragment>
      <button style={styles.button} onClick={() => setModalState(!modalState)}>
        Advance Configuration
      </button>
      <MDBModal
        isOpen={modalState}
        toggle={() => setModalState(!modalState)}
        style={styles.modal}
        size="lg"
      >
        <MDBModalHeader
          toggle={() => setModalState(!modalState)}
          style={styles.titlePadding}
        >
          {" "}
          <span style={styles.bold}>Advance Configuration</span>
        </MDBModalHeader>
        <MDBModalBody>
          <MDBRow style={styles.rowTab}>
            <MDBCol style={styles.tab}>
              <button
                style={scheme === 0 ? styles.buttonTabActive : styles.buttonTab}
                onClick={() => showNewScheme(SchemeType.ContributionReward)}
                // style={scheme === selectedForm['type'] ? styles.buttonTabActive : styles.buttonTab}
              >
                Contribution Reward
              </button>
            </MDBCol>
            <MDBCol style={styles.tab}>
              <button
                style={scheme === 1 ? styles.buttonTabActive : styles.buttonTab}
                onClick={() => showNewScheme(SchemeType.SchemeRegistrar)}
              >
                Scheme Registry
              </button>
            </MDBCol>
            <MDBCol style={styles.tab}>
              <button
                style={scheme === 2 ? styles.buttonTabActive : styles.buttonTab}
                onClick={() => showNewScheme(SchemeType.GenericScheme)}
              >
                Generic Scheme
              </button>
            </MDBCol>
          </MDBRow>

          <div style={styles.divForm}>
            <MDBRow style={styles.borderRow}>
              <MDBCol>
                <span style={styles.boldSpan}>Deploy {schemeName[scheme]}</span>
                <MDBTooltip placement="bottom" clickable>
                  <MDBBtn
                    floating
                    size="lg"
                    color="transparent"
                    style={styles.info}
                  >
                    <MDBIcon icon="info-circle" />
                  </MDBBtn>
                  <span>Some example</span>
                </MDBTooltip>
              </MDBCol>
              <MDBCol size="1">
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="toggle"
                    checked={schemeIsAdded}
                    onChange={e => handleScheme(scheme)}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="toggle"
                  ></label>
                </div>
              </MDBCol>
            </MDBRow>
            <GenesisProtocolEditor
              form={
                schemeIsAdded
                  ? selectedForm.$.votingMachine
                  : schemeEditorsMock[scheme].$.votingMachine
              }
              editable={schemeIsAdded}
            />
          </div>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBRow style={styles.buttonsRow}>
            <MDBCol size="6">
              <MDBBtn
                onClick={() => {
                  setAdvanceMode(false);
                  setModalState(!modalState);
                }}
              >
                Cancel
              </MDBBtn>
            </MDBCol>
            <MDBCol style={styles.save}>
              <MDBBtn
                color="primary"
                onClick={() => {
                  setAdvanceMode(true);
                  setModalState(!modalState);
                }}
              >
                Save Configuration
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </MDBModalFooter>
      </MDBModal>
    </Fragment>
  );
}

const styles = {
  button: {
    width: "174px",
    height: "42px",
    padding: "4px",
    border: "1px solid gray",
    boxShadow: "none",
    borderRadius: "4px",
    fontFamily: '"Roboto", sans-serif',
    fontWeight: 300,
    fontSize: "15px"
  },
  tab: {
    padding: "0px"
  },
  buttonTab: {
    width: "100%",
    margin: "auto",
    backgroundColor: "white !important",
    color: "gray",
    height: "52px",
    boxShadow: "none",
    borderTop: "none",
    borderBottom: "0.5px solid lightgray",
    borderLeft: "0.5px solid lightgray",
    borderRight: "0.5px solid lightgray"
  },
  buttonTabActive: {
    width: "100%",
    margin: "auto",
    backgroundColor: "white !important",
    color: "black",
    height: "52px",
    boxShadow: "none",
    borderTop: "none",
    borderBottom: "3px solid #4285f4",
    borderLeft: "0.5px solid lightgray",
    borderRight: "0.5px solid lightgray"
  },
  rowTab: {
    marginTop: "-15px",
    marginRight: "-16px",
    marginLeft: "-16px"
  },
  modal: {
    maxWidth: "700px !important"
  },
  info: {
    backgroundColor: "transparent !important",
    color: "lightgray",
    boxShadow: "none",
    fontSize: "large",
    border: "none",
    outline: "none",
    padding: 0
  },
  borderRow: {
    borderBottom: "0.5px solid lightgray",
    paddingBottom: "14px",
    paddingTop: "14px"
  },
  paddingRow: {
    paddingTop: "14px",
    paddingBottom: "14px"
  },
  date: {
    width: "50%",
    height: "100%"
  },
  dateTime: {
    width: "50%",
    height: "100%",
    content: "04:00 h"
  },
  lastRow: {
    borderBottom: "0.5px solid lightgray",
    paddingTop: "14px",
    paddingBottom: "14px"
  },
  buttonsRow: {
    width: "-webkit-fill-available",
    margin: "inherit"
  },
  save: {
    textAlign: "right"
  },
  inputStyle: {
    width: "100%"
  },
  divForm: {
    padding: "14px"
  },
  inputDiv: {
    width: "50%"
  },
  bold: {
    fontWeight: 400,
    fontSize: "23px"
  },
  saveButton: {
    height: "44px",
    borderRadius: "4px",
    width: "200px",
    color: "white",
    backgroundColor: "#4285f4"
  },
  cancelButton: {
    height: "44px",
    borderRadius: "4px",
    width: "100px"
  },
  titlePadding: {
    padding: "26px"
  },
  boldSpan: {
    fontWeight: 400
  }
};
export default AdvanceSchemeEditor;
