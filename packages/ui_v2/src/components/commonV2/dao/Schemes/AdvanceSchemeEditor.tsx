import React, { Fragment } from "react";
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
import GenesisProtocolEditor from "../GenesisProtocolEditor";
import FormField from "../../FormField";

export interface Props {
  form: any;
  modal: boolean;
  setModal: any;
  setAdvanceMode: any;
}

let schemes: Array<AnySchemeForm & IObservableObject> = [
  observable(new ContributionRewardForm()),
  observable(new SchemeRegistrarForm()),
  observable(new GenericSchemeForm())
];

function AdvanceSchemeEditor(props: Props) {
  const { form, modal, setModal, setAdvanceMode } = props;

  const [scheme, setScheme] = React.useState<number>(
    SchemeType.ContributionReward
  );
  const [schemeIsAdded, setSchemeIsAdded] = React.useState<boolean>(true);
  const [pluginManagerExists, setPluginManagerExists] = React.useState<boolean>(
    true
  );

  const [error, setError] = React.useState<string>("");

  const actualScheme = schemes.find((x: AnySchemeForm) => x.type === scheme);
  const params = actualScheme!.getParams();

  const checkSchemeInForm = (index: number) => {
    return form.$.some((scheme: AnySchemeForm) => scheme.type === +index);
  };

  const showNewScheme = (schemeIndex: number) => {
    setScheme(schemeIndex);
    setSchemeIsAdded(checkSchemeInForm(schemeIndex));
  };

  const handleScheme = (schemeIndex: number) => {
    const removeScheme = () => {
      const filterSchemes = (x: AnySchemeForm) => {
        if (schemeIndex !== x.type) return x;
      };
      const removeUndefined = (x: AnySchemeForm | undefined) => x;
      form.$ = form.$.map(filterSchemes).filter(removeUndefined);
    };

    const addScheme = (currentScheme: AnySchemeForm & IObservableObject) => {
      form.$.push(currentScheme);
    };

    schemeIsAdded ? removeScheme() : addScheme(schemes[schemeIndex]);
    setSchemeIsAdded(checkSchemeInForm(schemeIndex));
    const pluginManager = form.$.some(
      (scheme: AnySchemeForm) => scheme.type === 1
    );
    setPluginManagerExists(pluginManager);
  };

  const saveConfig = async () => {
    const { hasError } = await form.validate();
    if (hasError) {
      setError(form.error);
    } else {
      setAdvanceMode(true);
      setModal(false);
      setScheme(SchemeType.ContributionReward);
    }
  };

  const closeModal = () => {
    setAdvanceMode(false);
    setModal(false);
    setScheme(SchemeType.ContributionReward);
    form.$ = [new ContributionRewardForm(), new SchemeRegistrarForm()];
  };

  return (
    <Fragment>
      <MDBModal isOpen={modal} style={styles.modal} size="lg">
        <MDBModalHeader toggle={closeModal} style={styles.titlePadding}>
          {" "}
          <span style={styles.bold}>Advance Configuration</span>
        </MDBModalHeader>
        <MDBModalBody>
          <MDBRow style={styles.rowTab}>
            {schemes.map((s, index) => (
              <MDBCol style={styles.tab} key={"scheme-" + index}>
                <button
                  style={
                    scheme === index ? styles.buttonTabActive : styles.buttonTab
                  }
                  onClick={() => showNewScheme(index)}
                >
                  {s.displayName}
                </button>
              </MDBCol>
            ))}
          </MDBRow>
          <div style={styles.divForm}>
            <MDBRow style={styles.borderRow}>
              <MDBCol>
                <span style={styles.boldSpan}>
                  Deploy {schemes[scheme].displayName}
                </span>
                <MDBTooltip placement="bottom" clickable>
                  <MDBBtn
                    floating
                    size="lg"
                    color="transparent"
                    style={styles.info}
                  >
                    <MDBIcon icon="info-circle" />
                  </MDBBtn>
                  <span>{schemes[scheme].description}</span>
                </MDBTooltip>
              </MDBCol>
              {pluginManagerExists ? (
                <></>
              ) : (
                <MDBCol>
                  <span
                    style={{
                      fontWeight: 400,
                      color: "red",
                      alignItems: "center"
                    }}
                  >
                    Warning: Without a Plugin Manager your organization will not
                    be able to modify itself.
                  </span>
                </MDBCol>
              )}
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
                form.$[scheme]
                  ? form.$[scheme].$.votingMachine
                  : actualScheme!.$.votingMachine
              }
              editable={schemeIsAdded}
            />
            {params!.length > 0 ? (
              <>
                {params!.map((param: any, index: any) => (
                  <MDBRow key={`field-${index}`}>
                    <FormField
                      field={param}
                      editable={schemeIsAdded}
                      colSize={12}
                    />
                  </MDBRow>
                ))}
              </>
            ) : (
              <></>
            )}
          </div>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBRow style={styles.buttonsRow}>
            <MDBCol size="3">
              <button style={styles.cancelButton} onClick={closeModal}>
                Cancel
              </button>
            </MDBCol>
            <MDBCol style={{ textAlign: "center" }}>
              {
                <>
                  {error ? <p style={styles.errorMessage}>{error}</p> : <></>}
                </>
              }
            </MDBCol>
            <MDBCol style={styles.save}>
              <button style={styles.saveButton} onClick={saveConfig}>
                Save Configuration
              </button>
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
  errorMessage: {
    color: "red",
    marginTop: "10px"
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
