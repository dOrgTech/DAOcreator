import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTooltip,
  MDBIcon
} from "mdbreact";
import { SchemeType, GenesisProtocolPreset } from "@dorgtech/daocreator-lib";

import AdvanceSchemeEditor from "./AdvanceSchemeEditor";

interface Props {
  form: any;
  editable: boolean;
  enabled?: boolean;
  onToggle?: (toggled: boolean) => void;
  toggleCollapse: () => void;
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

function SchemeEditor(props: Props) {
  const { form, toggleCollapse } = props;

  const [decisionSpeed, setDecisionSpeed] = useState<DAOSpeed>(DAOSpeed.Medium);
  const [distribution, setDistribution] = useState<boolean>(false);
  const [rewardSuccess, setRewardSuccess] = useState<boolean>(false);
  const [rewardAndPenVoters, setRewardAndPenVoters] = useState<boolean>(false);
  const [autobet, setAutobet] = useState<boolean>(false);
  const [advanceMode, setAdvanceMode] = useState<boolean>(false);
  const [toggleSpeed, setToggleSpeed] = useState<boolean>(true);
  // Updates voting machines on toggle
  const updateVotingMachine = () => {
    form.$.map(checkDefaultChange);
    form.$.map(getVotingMachinePreset);
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
  // Not using Scheme interface because $ does not exist on it
  const getVotingMachinePreset = (scheme: any) => {
    console.log("asd");
    // Get voting machine preset using the decisionSpeed and scheme type
    const schemePresetMap = schemeSpeeds.get(decisionSpeed);

    let preset;
    if (schemePresetMap) preset = schemePresetMap.get(scheme.type);
    else throw Error("Unimplemented Scheme Speed Configuration");

    // Initialize the scheme's voting machine to the Genesis Protocol Preset
    const votingMachine = scheme.$.votingMachine;
    votingMachine.preset = preset;
    const {
      proposingRepReward,
      votersReputationLossRatio,
      minimumDaoBounty
    } = votingMachine.$;
    console.log("proposingRepReward.value", proposingRepReward.value);
    if (Number(proposingRepReward.value) > 0) setRewardSuccess(true);
    else setRewardSuccess(false);
    console.log(
      "votersReputationLossRatio.value",
      votersReputationLossRatio.value
    );
    if (Number(votersReputationLossRatio.value) > 0)
      setRewardAndPenVoters(true);
    else setRewardAndPenVoters(false);
    console.log("minimumDaoBounty.value", minimumDaoBounty.value);
    if (Number(minimumDaoBounty.value > 0)) setAutobet(true);
    else setAutobet(false);
    // Apply the effects of the toggles
    // if(!distribution) // TODO: distribution does not currently affect the voting machine
    if (!rewardSuccess) votingMachine.$.proposingRepReward.value = "0";
    if (!rewardAndPenVoters)
      votingMachine.$.votersReputationLossRatio.value = "0";
    if (!autobet) votingMachine.$.minimumDaoBounty.value = "0";
  };

  const dependeciesList = [
    form.$,
    decisionSpeed,
    distribution,
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

  return (
    <>
      <MDBContainer style={styles.paddingContainer}>
        <MDBRow>
          <MDBCol md="4"></MDBCol>
          <MDBCol md="4" className="offset-md-4">
            <AdvanceSchemeEditor form={form} setAdvanceMode={setAdvanceMode} />
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol>
            <p className="text-left" style={styles.title}>
              Recommend Configuration
            </p>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol>
            <p className="text-left" style={styles.subtitle}>
              Your proposal uses a proposal-vote structure and can securely
              scale to a big organization
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
                <span>Some example</span>
              </MDBTooltip>
            </MDBRow>
          </MDBCol>
          <MDBCol>
            <MDBRow style={styles.alignEnd}>
              <button
                name="decisonSpeed"
                value={DAOSpeed.Fast}
                style={
                  !(decisionSpeed === DAOSpeed.Fast) || !toggleSpeed
                    ? styles.buttonColor
                    : styles.buttonColorActive
                }
                onClick={handleClick}
                disabled={!toggleSpeed}
              >
                Fast
              </button>
              <button
                name="decisonSpeed"
                value={DAOSpeed.Medium}
                style={
                  !(decisionSpeed === DAOSpeed.Medium) || !toggleSpeed
                    ? styles.buttonColor
                    : styles.buttonColorActive
                }
                onClick={handleClick}
                disabled={!toggleSpeed}
              >
                Medium
              </button>
              <button
                name="decisonSpeed"
                value={DAOSpeed.Slow}
                style={
                  !(decisionSpeed === DAOSpeed.Slow) || !toggleSpeed
                    ? styles.buttonColor
                    : styles.buttonColorActive
                }
                onClick={handleClick}
                disabled={!toggleSpeed}
              >
                Slow
              </button>
            </MDBRow>
          </MDBCol>
        </MDBRow>

        <Toggleable
          id={"distribution"}
          text={"Distribute Dxdao token"}
          example={"Some example"}
          toggle={() => {
            setDistribution(!distribution);
          }}
          disabled={advanceMode}
          checked={distribution}
        />

        <Toggleable
          id={"rewardSuccess"}
          text={"Reward successful proposer"}
          example={"Some example"}
          toggle={() => {
            setRewardSuccess(!rewardSuccess);
          }}
          disabled={advanceMode}
          checked={rewardSuccess}
        />

        <Toggleable
          id={"rewardAndPenVoters"}
          text={"Reward correct voters and penalize incorrect voters"}
          example={"Some example"}
          toggle={() => {
            setRewardAndPenVoters(!rewardAndPenVoters);
          }}
          disabled={advanceMode}
          checked={rewardAndPenVoters}
        />

        <Toggleable
          id={"autobet"}
          text={"Auto-bet against every proposal to incentivise curation"}
          example={"Some example"}
          toggle={() => setAutobet(!autobet)}
          disabled={advanceMode}
          checked={autobet}
        />
      </MDBContainer>

      <MDBBtn
        color="blue darken-4"
        onClick={() => toggleCollapse()}
        style={styles.configButton}
      >
        Set Configuration
      </MDBBtn>
    </>
  );
}

interface ToggleProps {
  id: string;
  text: string;
  example: string;
  toggle: () => void;
  disabled: boolean;
  checked: boolean;
}

function Toggleable({
  id,
  text,
  example,
  toggle,
  disabled,
  checked
}: ToggleProps) {
  return (
    <MDBRow style={styles.paddingRow}>
      <MDBCol size="10" style={styles.noPadding}>
        <span style={styles.marginText} className="text-left">
          {text}
        </span>
        <MDBTooltip placement="bottom" clickable>
          <MDBBtn floating size="lg" color="transparent" style={styles.info}>
            {" "}
            <MDBIcon icon="info-circle" />
          </MDBBtn>
          <span>{example}</span>
        </MDBTooltip>
      </MDBCol>
      <MDBCol style={styles.noPadding}>
        <div className="custom-control custom-switch">
          <input
            type="checkbox"
            className="custom-control-input"
            id={id}
            onChange={() => toggle()}
            disabled={disabled}
            checked={checked}
          />
          <label className="custom-control-label" htmlFor={id}></label>
        </div>
      </MDBCol>
    </MDBRow>
  );
}

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
  paddingRow: {
    paddingLeft: "10px",
    paddingTop: "6px"
  },
  noPadding: {
    padding: 0
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
    padding: "7px"
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
