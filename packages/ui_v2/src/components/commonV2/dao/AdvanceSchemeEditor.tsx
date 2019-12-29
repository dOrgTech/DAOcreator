import * as React from "react";
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
import { Fragment } from "react";

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
  const [scheme, setScheme] = React.useState<number>(
    SchemeType.ContributionReward
  );
  const [schemeIsAdded, checkSchemeIsAdded] = React.useState<boolean>(false);

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

  const [modalState, setModalState] = React.useState<boolean>(false);

  return (
    <Fragment>
      <button
        //   color="black"
        style={styles.button}
        onClick={() => setModalState(!modalState)}
      >
        Advance Configuration
      </button>
      <MDBModal
        isOpen={modalState}
        toggle={() => setModalState(!modalState)}
        style={styles.modal}
        size="lg"
      >
        <MDBModalHeader toggle={() => setModalState(!modalState)}>
          Advance Configuration
        </MDBModalHeader>
        <MDBModalBody>
          <MDBRow style={styles.rowTab}>
            <MDBCol style={styles.tab}>
              <button
                style={styles.buttonTab}
                onClick={() => showNewScheme(SchemeType.ContributionReward)}
              >
                Contribution Reward
              </button>
            </MDBCol>
            <MDBCol style={styles.tab}>
              <button
                style={styles.buttonTab}
                onClick={() => showNewScheme(SchemeType.SchemeRegistrar)}
              >
                Scheme Registry
              </button>
            </MDBCol>
            <MDBCol style={styles.tab}>
              <button
                style={styles.buttonTab}
                onClick={() => showNewScheme(SchemeType.GenericScheme)}
              >
                Generic Scheme
              </button>
            </MDBCol>
          </MDBRow>

          <div style={styles.divForm}>
            <MDBRow style={styles.borderRow}>
              <MDBCol>
                <span>Deploy {schemeName[scheme]}</span>
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
            {schemeIsAdded ? (
              <GenesisProtocolEditor
                form={selectedForm.$.votingMachine}
                editable={true}
              />
            ) : (
              ""
            )}
            {/* <MDBRow style={styles.paddingRow}>
              <MDBCol>
                <span>Queued Vote Period Limit</span>
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
              <MDBCol size="3">
                <input
                  style={styles.date}
                  type="number"
                  name="queuedDays"
                  placeholder={queuedDaysState}
                  id="queuedDays"
                  onChange={(e: any) => setQueuedDaysState(e.target.value)}
                  required
                />
                <input
                  style={styles.dateTime}
                  type="time"
                  name="queuedHours"
                  value={queuedHoursState}
                  onChange={(e: any) => setQueuedHoursState(e.target.value)}
                  required
                  id="queuedHours"
                ></input>
              </MDBCol>
            </MDBRow> */}
            {/* <MDBRow style={styles.paddingRow}>
              <MDBCol>
                <span>Pre-Boosted Vote Period Limit</span>
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
              <MDBCol size="3">
                <input
                  style={styles.date}
                  type="number"
                  name="quantity"
                  placeholder={preBoostedDayState}
                  id="preBoostedDay"
                  required
                  onChange={(e: any) => setPreBoostedDayState(e.target.value)}
                />
                <input
                  style={styles.date}
                  type="time"
                  id="preBoostedHours"
                  name="preBoostedHours"
                  value={preBoostedHoursState}
                  onChange={(e: any) => setPreBoostedHoursState(e.target.value)}
                  required
                ></input>
              </MDBCol>
            </MDBRow> */}
            {/* <MDBRow style={styles.paddingRow}>
              <MDBCol>
                <span>Boosted Vote Period</span>
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
              <MDBCol size="3">
                <input
                  style={styles.date}
                  type="number"
                  name="boostedDay"
                  placeholder={boostedDayState}
                  id="boostedDay"
                  required
                  onChange={(e: any) => setBoostedDayState(e.target.value)}
                />
                <input
                  style={styles.date}
                  type="time"
                  id="boostedHours"
                  name="boostedHours"
                  value={boostedHoursState}
                  required
                  onChange={(e: any) => setBoostedHoursState(e.target.value)}
                ></input>
              </MDBCol>
            </MDBRow>
            <MDBRow style={styles.paddingRow}>
              <MDBCol>
                <span>Quiet Ending Period</span>
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
              <MDBCol size="3">
                <input
                  style={styles.date}
                  type="number"
                  name="quietDay"
                  id="quietDay"
                  placeholder={quietDayState}
                  required
                  onChange={(e: any) => setQuietDayState(e.target.value)}
                />
                <input
                  style={styles.date}
                  type="time"
                  id="quietHours"
                  name="quietHours"
                  value={quietHoursState}
                  required
                  onChange={(e: any) => setQuietHoursState(e.target.value)}
                ></input>
              </MDBCol>
            </MDBRow>
            <MDBRow style={styles.lastRow}>
              <MDBCol>
                <span>Locking / Activation Time</span>
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
              <MDBCol size="3">
                <input
                  style={styles.date}
                  type="number"
                  name="lockingDay"
                  id="lockingDay"
                  placeholder={lockingDayState}
                  onChange={(e: any) => setLockingDayState(e.target.value)}
                  required
                />
                <input
                  style={styles.date}
                  type="time"
                  id="lockingHours"
                  name="lockingHours"
                  value={lockingHoursState}
                  required
                  onChange={(e: any) => setLockingHoursState(e.target.value)}
                ></input>
              </MDBCol>
            </MDBRow>

            <MDBRow style={styles.paddingRow}>
              <MDBCol size="6">
                <span>QUEUED VOTE REQUIRED</span>
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
                <br></br>
                <input
                  type="number"
                  id="queuedVote"
                  name="queuedVote"
                  placeholder={queuedVoteState.toString()}
                  style={styles.inputStyle}
                  onChange={(e: any) =>
                    setQueuedVoteState(Number(e.target.value))
                  }
                />
              </MDBCol>
              <MDBCol size="6">
                <span>MINIMUM DAO BOUNTY</span>
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
                <br></br>
                <input
                  type="text"
                  id="minimumDao"
                  name="minimumDao"
                  placeholder={minimumDaoState.toString()}
                  style={styles.inputStyle}
                  onChange={(e: any) =>
                    setMinimumDaoState(Number(e.target.value))
                  }
                />
              </MDBCol>
            </MDBRow>

            <MDBRow style={styles.paddingRow}>
              <MDBCol size="6">
                <span>THERESHOLD CONSTANT</span>
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
                <br></br>
                <input
                  type="text"
                  id="thereshold"
                  name="thereshold"
                  placeholder={theresholdState.toString()}
                  style={styles.inputStyle}
                  onChange={(e: any) =>
                    setTheresholdState(Number(e.target.value))
                  }
                />
              </MDBCol>
              <MDBCol size="6">
                <span>VOTERS REPUTATION LOSS RATIO</span>
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
                <br></br>
                <input
                  type="text"
                  id="votersReputation"
                  name="votersReputation"
                  placeholder={votersReputationState.toString()}
                  style={styles.inputStyle}
                  onChange={(e: any) =>
                    setVotersReputationState(Number(e.target.value))
                  }
                />
              </MDBCol>
            </MDBRow>

            <MDBRow style={styles.paddingRow}>
              <MDBCol size="6">
                <span>REWARD SUCCESSFUL PROPOSER</span>
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
                <br></br>
                <input
                  type="text"
                  id="rewardSuccessful"
                  name="rewardSuccessful"
                  placeholder={rewardSuccessfulState.toString()}
                  style={styles.inputStyle}
                  onChange={(e: any) =>
                    setRewardSuccessfulState(Number(e.target.value))
                  }
                />
              </MDBCol>
              <MDBCol size="6">
                <span>ACTIVATION TIME</span>
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
                <br></br>

                <input
                  type="date"
                  id="activationDate"
                  name="activationDate"
                  placeholder="Date"
                  value={activationDateState}
                  style={styles.inputDiv}
                  onChange={(e: any) => {
                    setActivationDateState(e.target.value);
                  }}
                />

                <input
                  type="time"
                  name="activationHours"
                  id="activationHours"
                  value={activationHoursState}
                  style={styles.inputDiv}
                  onChange={(e: any) => {
                    setActivationHoursState(e.target.value);
                  }}
                />
              </MDBCol>
            </MDBRow>

            <MDBRow style={styles.paddingRow}>
              <MDBCol>
                <span>VOTE ON BEHALF</span>
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
                <br></br>
                <input
                  type="text"
                  id="voteBehalf"
                  name="voteBehalf"
                  placeholder="0x..."
                  style={styles.inputStyle}
                  onChange={(e: any) => setVoteBehalfState(e.target.value)}
                />
              </MDBCol>
            </MDBRow> */}
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
    color: "black",
    height: "52px",
    boxShadow: "none",
    borderTop: "none",
    borderBottom: "0.5px solid lightgray",
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
    width: "-webkit-fill-available"
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
  }
};
export default AdvanceSchemeEditor;
