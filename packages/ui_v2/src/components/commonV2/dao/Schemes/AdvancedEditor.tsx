import React, { FC, useState, useEffect } from "react";
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
import {
  AnySchemeForm,
  GenericSchemeForm,
  ContributionRewardForm,
  SchemeRegistrarForm,
  SchemeType,
  SchemesForm,
  GenesisProtocolForm,
  Scheme,
  AnyField
} from "@dorgtech/daocreator-lib";
import VotingMachineEditor from "../VotingMachineEditor";
import FormField from "../../FormField";
import { GenesisProtocolConfig } from "@dorgtech/daocreator-lib/dist/dependency/arc";

interface Props {
  form: SchemesForm;
  defaultVMs: [
    GenesisProtocolConfig,
    GenesisProtocolConfig,
    GenesisProtocolConfig
  ];
  updateVotingMachines: (advancedSchemes: GenesisProtocolForm[]) => void;
  resetForm: () => void;
  modal: boolean; // TODO Could be removed and stay true
  setModal: (modal: boolean) => void;
}

const schemeTemplates: AnySchemeForm[] = [
  new ContributionRewardForm(),
  new SchemeRegistrarForm(),
  new GenericSchemeForm()
];

const AdvancedEditor: FC<Props> = ({
  form,
  defaultVMs,
  updateVotingMachines,
  resetForm,
  modal,
  setModal
}) => {
  /*
   * State
   */

  const [advForm, setAdvForm] = useState<SchemesForm>(new SchemesForm());

  // Active Scheme
  const [scheme, setScheme] = useState<Scheme>(advForm.values[0]);

  // Active toggles. Disable allows for removal from ui without scheme reset
  const [isActive, setIsActive] = useState([true, true, false]);

  const [warning, setWarning] = useState<string>();
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!modal) return;
    console.log(modal);
    // setScheme(advForm[0]);
    updateAdvancedForm();
  }, [modal]);

  // Check that scheme of type 1 is active
  useEffect(() => {
    if (isActive[SchemeType.SchemeRegistrar]) {
      setWarning("");
      return;
    }
    setWarning(
      "Warning: Without a Plugin Manager your organization will not be able to modify itself."
    );
  }, [isActive[SchemeType.SchemeRegistrar]]);

  // on Advanced mode open
  const updateAdvancedForm = () => {
    // TODO Extract values from form and add them to advForm
    // And update activeToggles

    const newAdvForm = new SchemesForm();

    defaultVMs.map((votingMachine: GenesisProtocolConfig, index: number) => {
      const formScheme = form.$.filter(
        (scheme: AnySchemeForm) => scheme.type === index
      );
      if (formScheme.length === 1) {
        newAdvForm.$.push(formScheme[0] as AnySchemeForm);
        return votingMachine;
      }
      newAdvForm.$.push(schemeTemplates[index]);
      newAdvForm.$[index].$.votingMachine.setValues(defaultVMs[index]);
      return votingMachine;
    });

    setAdvForm(newAdvForm);
    setScheme(newAdvForm.values[0]);
    console.log("newAdvForm", newAdvForm);
  };

  const toggleActiveScheme = (index: number) => {
    setIsActive(
      isActive.map((toggle: boolean, i: number) =>
        i === index ? !toggle : toggle
      )
    );
  };

  const updateForm = () => {
    let schemes: AnySchemeForm[] = [];
    isActive.map((toggle: boolean, index: number) => {
      toggle && schemes.push(advForm.values[index]);
      return toggle;
    });

    // Potentially unnecessary
    const newAdvForm = new SchemesForm();
    // TODO advanced form should keep a length of 3 where inactive = disabled defaults
    newAdvForm.setValues(schemes);

    updateVotingMachines(
      schemes.map((scheme: AnySchemeForm) => scheme.values.votingMachine)
    );
  };

  // Resets entire form
  const resetAdvancedForm = () => {
    resetForm();

    updateAdvancedForm();
  };

  const closeModal = async (reset = false) => {
    if (reset) {
      resetAdvancedForm();
      setModal(false);
      return;
    }

    const { hasError } = await advForm.validate();
    if (hasError) {
      advForm.error && setErrors([...errors, advForm.error]);
      return;
    }

    updateForm();
    setModal(false);
  };

  console.log(scheme);
  if (!scheme) return <></>;

  return (
    <MDBModal isOpen={modal} style={styles.modal} size="lg">
      <MDBModalHeader toggle={closeModal} style={styles.titlePadding}>
        <span style={styles.bold}>Advance Configuration</span>
      </MDBModalHeader>
      <MDBModalBody>
        <MDBRow style={styles.rowTab}>
          {schemeTemplates.map((schemeTemplate, index) => (
            <MDBCol style={styles.tab} key={"scheme-" + index}>
              <button
                style={
                  scheme.type === index
                    ? styles.buttonTabActive
                    : styles.buttonTab
                }
                onClick={() => setScheme(advForm.values[index])}
              >
                {schemeTemplate.displayName}
              </button>
            </MDBCol>
          ))}
        </MDBRow>
        <div style={styles.divForm}>
          <MDBRow style={styles.borderRow}>
            <MDBCol>
              <span style={styles.boldSpan}>
                Deploy {schemeTemplates[scheme.type].displayName}
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
                <span>{schemeTemplates[scheme.type].description}</span>
              </MDBTooltip>
            </MDBCol>
            {warning && (
              <MDBCol>
                <span
                  style={{
                    fontWeight: 400,
                    color: "red",
                    alignItems: "center"
                  }}
                >
                  {/* TODO check */}
                  <p style={styles.errorMessage}>{warning}</p>
                </span>
              </MDBCol>
            )}
            <MDBCol size="1">
              <div className="custom-control custom-switch">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="toggle"
                  checked={isActive[scheme.type]}
                  onChange={() => toggleActiveScheme(scheme.type)}
                />
                <label
                  className="custom-control-label"
                  htmlFor="toggle"
                ></label>
              </div>
            </MDBCol>
          </MDBRow>
          <VotingMachineEditor
            fields={advForm.$[scheme.type].values.votingMachine.values}
            editable={isActive[scheme.type]}
          />
          {/* TODO ? */}
          {schemeTemplates[scheme.type]
            .getParams()
            .map((field: AnyField, index: number) => (
              <MDBRow key={`field-${index}`}>
                <FormField
                  field={field}
                  editable={isActive[scheme.type]}
                  colSize={12}
                />
              </MDBRow>
            ))}
        </div>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBRow style={styles.buttonsRow}>
          <MDBCol size="3">
            <button
              style={styles.cancelButton}
              onClick={() => closeModal(true)}
            >
              Cancel
            </button>
          </MDBCol>
          <MDBCol style={{ textAlign: "center" }}>
            {errors.map(error => (
              <p style={styles.errorMessage}>{error}</p>
            ))}
          </MDBCol>
          <MDBCol style={styles.save}>
            <button style={styles.saveButton} onClick={() => closeModal()}>
              Save Configuration
            </button>
          </MDBCol>
        </MDBRow>
      </MDBModalFooter>
    </MDBModal>
  );
};

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

export default AdvancedEditor;
