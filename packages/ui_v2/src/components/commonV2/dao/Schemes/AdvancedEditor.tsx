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
  Scheme
} from "@dorgtech/daocreator-lib";
import VotingMachineEditor from "../VotingMachineEditor";
import FormField from "../../FormField";
import { GenesisProtocolConfig } from "@dorgtech/daocreator-lib/dist/dependency/arc";

interface Props {
  form: SchemesForm;
  modal: boolean;
  setModal: (modal: boolean) => void;
  defaultVMs: [
    GenesisProtocolConfig,
    GenesisProtocolConfig,
    GenesisProtocolConfig
  ];
  updateVotingMachine: (advancedSchemes: AnySchemeForm[]) => void;
}

const schemes: AnySchemeForm[] = [
  new ContributionRewardForm(),
  new SchemeRegistrarForm(),
  new GenericSchemeForm()
];

const AdvancedEditor: FC<Props> = ({
  form,
  modal,
  setModal,
  defaultVMs,
  updateVotingMachine
}) => {
  // Whether modal is open
  const [open, setOpen] = useState(false);

  // Seperate form
  const [advForm, setAdvForm] = useState<SchemesForm>(new SchemesForm());

  // Active toggles. Disable allows for removal from ui without scheme reset
  const [isActive, setIsActive] = useState([true, true, false]);

  const [warnings, setWarning] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;

    updateAdvancedForm();
  }, [open]);

  // Check that scheme of type 1 is active
  useEffect(() => {
    setWarning([
      ...warnings,
      "Warning: Without a Plugin Manager your organization will not be able to modify itself."
    ]);
  }, [isActive[SchemeType.SchemeRegistrar]]);

  // on Advanced mode open
  const updateAdvancedForm = () => {
    // TODO Extract values from form and add them to advForm
    // And update activeToggles
    setAdvForm(form);
  };

  // Resets entire form
  const resetAdvancedForm = () => {
    const resetForm: AnySchemeForm[] = [
      new ContributionRewardForm(),
      new SchemeRegistrarForm()
    ];
    form.$ = resetForm;

    updateAdvancedForm();
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

    const newToggles = isActive.map((toggle: boolean, index: number) => {
      toggle && schemes.push(advForm.values[index]);
      return toggle;
    });

    setIsActive(newToggles);

    // Potentially unnecessary
    const newAdvForm = advForm;
    // TODO advanced form should keep a length of 3 where inactive = disabled defaults
    newAdvForm.setValues(schemes);
    setAdvForm(advForm);
  };

  // ---------------------

  // const handleScheme = (schemeIndex: number) => {
  //   const removeScheme = () => {
  //     const filterSchemes = (x: AnySchemeForm) => {
  //       if (schemeIndex !== x.type) return x;
  //     };
  //     const removeUndefined = (x: AnySchemeForm | undefined) => x;
  //     form.$ = form.$.map(filterSchemes).filter(removeUndefined); // TODO
  //   };

  //   const addScheme = (currentScheme: AnySchemeForm) => {
  //     form.$.push(currentScheme);
  //   };

  //   schemeIsAdded ? removeScheme() : addScheme(schemes[schemeIndex]);
  //   setSchemeIsAdded(checkSchemeInForm(schemeIndex));
  //   const pluginManager = form.$.some(
  //     (scheme: AnySchemeForm) => scheme.type === 1
  //   );
  //   setPluginManagerExists(pluginManager);
  // };

  // Initial Scheme
  const [scheme, setScheme] = useState(SchemeType.ContributionReward);

  const [schemeIsAdded, setSchemeIsAdded] = useState(true);
  const [pluginManagerExists, setPluginManagerExists] = useState(true);

  const [error, setError] = useState("");

  const actualScheme = schemes.find((x: AnySchemeForm) => x.type === scheme);
  const params = actualScheme!.getParams();

  const checkSchemeInForm = (index: number) => {
    return form.$.some((scheme: AnySchemeForm) => scheme.type === +index);
  };

  const showNewScheme = (schemeIndex: number) => {
    setScheme(schemeIndex);
    setSchemeIsAdded(checkSchemeInForm(schemeIndex));
  };

  // Resets advanced config and validates form
  // Error is set but never unset
  const saveConfig = async () => {
    const { hasError } = await form.validate();
    if (hasError) {
      // setError(form.error); TODO
    } else {
      // setAdvanceMode(true);
      setModal(false);
      setScheme(SchemeType.ContributionReward);
    }
  };

  // Reset advanced config and wipe schemes
  const closeModal = () => {
    // setAdvanceMode(false);
    setModal(false);
    setScheme(SchemeType.ContributionReward);
    form.$ = [new ContributionRewardForm(), new SchemeRegistrarForm()];
  };

  return (
    <MDBModal isOpen={modal} style={styles.modal} size="lg">
      <MDBModalHeader toggle={closeModal} style={styles.titlePadding}>
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
            {!pluginManagerExists && (
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
                  // onChange={() => toggleActiveScheme(index)} // Todo
                />
                <label
                  className="custom-control-label"
                  htmlFor="toggle"
                ></label>
              </div>
            </MDBCol>
          </MDBRow>
          <VotingMachineEditor
            fields={
              form.$[scheme]
                ? form.$[scheme].values.votingMachine.values
                : actualScheme!.values.votingMachine.values
            }
            editable={schemeIsAdded}
          />
          {params!.length > 0 &&
            params.map((param: any, index: number) => (
              <MDBRow key={`field-${index}`}>
                <FormField
                  field={param}
                  editable={schemeIsAdded}
                  colSize={12}
                />
              </MDBRow>
            ))}
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
            {error && <p style={styles.errorMessage}>{error}</p>}
          </MDBCol>
          <MDBCol style={styles.save}>
            <button style={styles.saveButton} onClick={saveConfig}>
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
