import React, { useState, useEffect, FC } from "react";
import { observer } from "mobx-react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTooltip,
  MDBIcon
} from "mdbreact";
import {
  SchemeType,
  GenesisProtocolPreset,
  SchemesForm
} from "@dorgtech/daocreator-lib";

import AdvanceSchemeEditor from "./AdvanceSchemeEditor";
import Toggle from "./Toggle";

interface Props {
  form: SchemesForm;
  editable: boolean;
  enabled?: boolean;
  onToggle?: (toggled: boolean) => void;
  toggleCollapse: () => void;
  modal: boolean;
  setModal: (modal: boolean) => void;
  advancedScheme: any;
}

enum DAOSpeed {
  Slow,
  Medium,
  Fast
}

class SchemePresets extends Map<SchemeType, GenesisProtocolPreset> {}
class SchemeSpeeds extends Map<DAOSpeed, SchemePresets> {}

const schemeSpeeds: SchemeSpeeds = new SchemeSpeeds([
  [
    DAOSpeed.Slow,
    new SchemePresets([
      [SchemeType.ContributionReward, GenesisProtocolPreset.Critical],
      [SchemeType.SchemeRegistrar, GenesisProtocolPreset.Critical],
      [SchemeType.GenericScheme, GenesisProtocolPreset.Critical]
    ])
  ],
  [
    DAOSpeed.Medium,
    new SchemePresets([
      [SchemeType.ContributionReward, GenesisProtocolPreset.Normal],
      [SchemeType.SchemeRegistrar, GenesisProtocolPreset.Critical],
      [SchemeType.GenericScheme, GenesisProtocolPreset.Normal]
    ])
  ],
  [
    DAOSpeed.Fast,
    new SchemePresets([
      [SchemeType.ContributionReward, GenesisProtocolPreset.Easy],
      [SchemeType.SchemeRegistrar, GenesisProtocolPreset.Normal],
      [SchemeType.GenericScheme, GenesisProtocolPreset.Easy]
    ])
  ]
]);

const SchemeEditor: FC<Props> = ({ form, toggleCollapse, modal, setModal }) => {
  const [decisionSpeed, setDecisionSpeed] = useState<DAOSpeed>(DAOSpeed.Medium);
  const [rewardSuccess, setRewardSuccess] = useState<boolean>(true);
  const [rewardAndPenVoters, setRewardAndPenVoters] = useState<boolean>(true);
  const [autobet, setAutobet] = useState<boolean>(true);
  const [toggleSpeed, setToggleSpeed] = useState<boolean>(true);

  const [advanceMode, setAdvanceMode] = useState<boolean>(false);

  // Updates voting machines on toggle
  const updateVotingMachine = () => {
    form.$.forEach(checkDefaultChange);
    form.$.forEach(getVotingMachinePreset);
  };
  // TODO: This below will be refactored, the logic below is to grey out speed decision buttons,
  // If any of the three *periodLimit parameters are changed from the default setting, then these options should be greyed out
  const checkDefaultChange = (scheme: any) => {
    const {
      queuedVotePeriodLimit,
      preBoostedVotePeriodLimit,
      boostedVotePeriodLimit
    } = scheme.values.votingMachine.values;
    switch (decisionSpeed) {
      case 0:
        switch (scheme.displayName) {
          case "ContributionReward":
            if (
              queuedVotePeriodLimit !== "30:0:0:0" ||
              preBoostedVotePeriodLimit !== "1:0:0:0" ||
              boostedVotePeriodLimit !== "4:0:0:0"
            ) {
              // disable buttons
              setToggleSpeed(false);
            }
            break;
          case "Scheme Registrar":
            if (
              queuedVotePeriodLimit !== "60:0:0:0" ||
              preBoostedVotePeriodLimit !== "2:0:0:0" ||
              boostedVotePeriodLimit !== "8:0:0:0"
            ) {
              // disable buttons
              setToggleSpeed(false);
            }
            break;
        }
        break;
      case 1:
        switch (scheme.displayName) {
          case "ContributionReward":
            if (
              queuedVotePeriodLimit !== "60:0:0:0" ||
              preBoostedVotePeriodLimit !== "2:0:0:0" ||
              boostedVotePeriodLimit !== "8:0:0:0"
            ) {
              // disable buttons
              setToggleSpeed(false);
            }
            break;
          case "Scheme Registrar":
            if (
              queuedVotePeriodLimit !== "60:0:0:0" ||
              preBoostedVotePeriodLimit !== "2:0:0:0" ||
              boostedVotePeriodLimit !== "8:0:0:0"
            ) {
              // disable buttons
              setToggleSpeed(false);
            }
            break;
        }
        break;
      case 2:
        switch (scheme.displayName) {
          case "ContributionReward":
            if (
              queuedVotePeriodLimit !== "30:0:0:0" ||
              preBoostedVotePeriodLimit !== "1:0:0:0" ||
              boostedVotePeriodLimit !== "4:0:0:0"
            ) {
              // disable buttons
              setToggleSpeed(false);
            }
            break;
          case "Scheme Registrar":
            if (
              queuedVotePeriodLimit !== "60:0:0:0" ||
              preBoostedVotePeriodLimit !== "2:0:0:0" ||
              boostedVotePeriodLimit !== "8:0:0:0"
            ) {
              // disable buttons
              setToggleSpeed(false);
            }
            break;
        }
        break;
    }
  };
  // TODO
  // Not using Scheme interface because $ does not exist on it
  const getVotingMachinePreset = (scheme: any) => {
    // Get voting machine preset using the decisionSpeed and scheme type
    const schemePresetMap = schemeSpeeds.get(decisionSpeed);
    let preset;
    if (schemePresetMap) preset = schemePresetMap.get(scheme.type);
    else throw Error("Unimplemented Scheme Speed Configuration");

    // Initialize the scheme's voting machine to the Genesis Protocol Preset
    const votingMachine = scheme.$.votingMachine;
    votingMachine.preset = preset;
    if (advanceMode) {
      const {
        proposingRepReward,
        votersReputationLossRatio,
        minimumDaoBounty
      } = votingMachine.$;
      setRewardSuccess(Number(proposingRepReward.value) > 0);
      setRewardAndPenVoters(Number(votersReputationLossRatio.value) > 0);
      setAutobet(Number(minimumDaoBounty.value) > 0);
    }

    // Apply the effects of the toggles
    if (!rewardSuccess) votingMachine.$.proposingRepReward.value = "0";
    if (!rewardAndPenVoters)
      votingMachine.$.votersReputationLossRatio.value = "0";
    if (!autobet) votingMachine.$.minimumDaoBounty.value = "0";
  };

  const dependeciesList = [
    decisionSpeed,
    rewardSuccess,
    rewardAndPenVoters,
    autobet,
    advanceMode
  ];
  // Updates voting machines on toggle
  useEffect(updateVotingMachine, dependeciesList);

  const handleClick = (e: any) => {
    setDecisionSpeed(parseInt(e.target.value));
  };

  const setConfiguration = () => {
    if (!advanceMode) {
      updateVotingMachine();
    }
    toggleCollapse();
  };

  return (
    <>
      <MDBContainer style={styles.paddingContainer}>
        <MDBRow>
          <MDBCol md="4"></MDBCol>
          <MDBCol md="4" className="offset-md-4">
            <AdvanceSchemeEditor
              form={form}
              setModal={setModal}
              modal={modal}
              setAdvanceMode={setAdvanceMode}
            />
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol>
            <p className="text-left" style={styles.title}>
              Recommended Configuration
            </p>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol>
            <p className="text-left" style={styles.subtitle}>
              Your organization uses a reputation-weighted voting system to make
              decisions.
            </p>
          </MDBCol>
        </MDBRow>

        <MDBRow style={styles.box}>
          <MDBCol size="6">
            <MDBRow>
              <span style={styles.marginText} className="text-left">
                Decision making
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
                <span>How quickly your organization processes proposals</span>
              </MDBTooltip>
            </MDBRow>
          </MDBCol>
          <MDBCol>
            <MDBRow style={styles.alignEnd}>
              <button
                name="decisonSpeed"
                value={DAOSpeed.Fast}
                style={
                  !(decisionSpeed === DAOSpeed.Fast)
                    ? styles.buttonColor
                    : styles.buttonColorActive
                }
                onClick={handleClick}
                disabled={advanceMode && !toggleSpeed}
              >
                Fast
              </button>
              <button
                name="decisonSpeed"
                value={DAOSpeed.Medium}
                style={
                  !(decisionSpeed === DAOSpeed.Medium)
                    ? styles.buttonColor
                    : styles.buttonColorActive
                }
                onClick={handleClick}
                disabled={advanceMode && !toggleSpeed}
              >
                Medium
              </button>
              <button
                name="decisonSpeed"
                value={DAOSpeed.Slow}
                style={
                  !(decisionSpeed === DAOSpeed.Slow)
                    ? styles.buttonColor
                    : styles.buttonColorActive
                }
                onClick={handleClick}
                disabled={advanceMode && !toggleSpeed}
              >
                Slow
              </button>
            </MDBRow>
          </MDBCol>
        </MDBRow>

        <Toggle
          id={"rewardSuccess"}
          text={"Reward successful proposer"}
          tooltip={"Successful proposers gain additional voting power"}
          toggle={() => {
            setRewardSuccess(!rewardSuccess);
          }}
          disabled={advanceMode}
          checked={rewardSuccess}
        />

        <Toggle
          id={"rewardAndPenVoters"}
          text={"Reward correct voters and penalize incorrect voters"}
          tooltip={
            "Voters on the winning side of proposals gain voting power, voters on the losing side lose voting power"
          }
          toggle={() => {
            setRewardAndPenVoters(!rewardAndPenVoters);
          }}
          disabled={advanceMode}
          checked={rewardAndPenVoters}
        />

        <Toggle
          id={"autobet"}
          text={"Auto-bet against every proposal to incentivise curation"}
          tooltip={
            "The organization bets against every proposal to incentivize the GEN curation network"
          }
          toggle={() => setAutobet(!autobet)}
          disabled={advanceMode}
          checked={autobet}
        />
      </MDBContainer>

      <button onClick={setConfiguration} style={styles.configButton}>
        Set Configuration
      </button>
    </>
  );
};

const styles = {
  card: {
    minWidth: 250,
    maxWidth: 420
  },
  schemeIcon: {
    width: "100%",
    height: "100%"
  },
  schemeDescription: {
    marginBottom: 15
  },
  column: {
    alignItems: "center"
  },
  box: {
    borderTop: "1px solid lightgray",
    borderBottom: "1px solid lightgray",
    padding: "10px"
  },
  buttonColor: {
    color: "black",
    borderRadius: "0.25rem",
    fontWeight: 300,
    width: "28%",
    height: "38px",
    fontSize: "14px",
    margin: "auto"
  },
  buttonColorActive: {
    color: "white",
    borderRadius: "0.25rem",
    fontWeight: 300,
    width: "28%",
    height: "38px",
    fontSize: "14px",
    backgroundColor: "#1976d2",
    margin: "auto"
  },
  info: {
    backgroundColor: "transparent !important",
    color: "lightgray",
    boxShadow: "none",
    fontSize: "large",
    border: "none",
    outline: "none"
  },
  marginText: {
    marginTop: "6px",
    color: "black",
    fontSize: "16px"
  },
  alignEnd: {
    flexDirection: "row-reverse"
  },
  configButton: {
    borderRadius: "0.37rem",
    marginTop: "28px",
    // marginBottom: '15px',
    height: "45px",
    marginLeft: "6px",
    fontWeight: 300,
    backgroundColor: "#1976d2",
    color: "white",
    width: "145px",
    padding: "7px",
    fontSize: "smaller",
    marginBottom: "20px"
  },
  modalButton: {
    width: "174px",
    height: "42px",
    padding: "4px",
    fontSize: "small",
    border: "1px solid lightgray",
    boxShadow: "none",
    borderRadius: "4px"
  },
  title: {
    fontWeight: 600,
    fontSize: "17px"
  },
  subtitle: {
    fontSize: "15px",
    color: "gray",
    fontFamily: "inherit"
  },
  toggle: {
    textAlign: '"right"'
  },
  paddingContainer: {
    padding: "8px"
  }
};

export default observer(SchemeEditor);
