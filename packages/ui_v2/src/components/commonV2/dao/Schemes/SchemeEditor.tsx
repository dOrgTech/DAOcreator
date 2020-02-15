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
  SchemesForm,
  AnySchemeForm,
  GenesisProtocolForm
} from "@dorgtech/daocreator-lib";

import AdvanceSchemeEditor from "./AdvanceSchemeEditor";
import Toggle from "./Toggle";
import { GenesisProtocolConfig } from "@dorgtech/daocreator-lib/dist/dependency/arc";

interface Props {
  form: SchemesForm;
  toggleCollapse: () => void;
  modal: boolean;
  setModal: (modal: boolean) => void;
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
  // Toggles
  const [decisionSpeed, setDecisionSpeed] = useState<DAOSpeed>(DAOSpeed.Medium);
  const [rewardSuccess, setRewardSuccess] = useState(true);
  const [rewardAndPenVoters, setRewardAndPenVoters] = useState(true);
  const [autobet, setAutobet] = useState(true);

  const [votingMachines, setVotingMachines] = useState<GenesisProtocolForm[]>(
    []
  );
  const [presetVotingMachines, setPresetVotingMachines] = useState<
    GenesisProtocolConfig[]
  >([]);

  const [advanceMode, setAdvanceMode] = useState(false);

  // TODO onMount
  useEffect(() => {
    const vms: GenesisProtocolForm[] = [];
    const vmPresets: GenesisProtocolConfig[] = [];

    form.$.map((scheme: AnySchemeForm) => {
      // Get voting machine preset using the decisionSpeed and scheme type
      const schemePresetMap = schemeSpeeds.get(decisionSpeed);

      if (schemePresetMap === undefined)
        throw Error("Unimplemented Scheme Speed Configuration");

      const vm: GenesisProtocolForm = scheme.values.votingMachine;
      const preset = schemePresetMap.get(scheme.type);

      if (preset === undefined) throw Error("Preset not found");

      vm.preset = preset;

      vms.push(vm);
      vmPresets.push(vm.values); // just added the values

      // if (!votingMachines[index]) {
      //   vms.push(vm);
      //   return scheme;
      // }

      // // Might potentially save changes (?)
      // votingMachines[index].preset = vm.preset;
      return scheme;
    });

    setVotingMachines(vms);
    vms.map(vm => (vm.$.minimumDaoBounty.value = "6969"));
    setPresetVotingMachines(vmPresets);
    console.log(vmPresets);
  }, [form.$, decisionSpeed]);

  useEffect(() => {
    if (!form.$) return;
    form.$.map(
      (scheme: AnySchemeForm, index: number) =>
        (scheme.$.votingMachine = votingMachines[index])
    );
    console.log(
      form
      // form.$.map(
      //   scheme =>
      //     scheme.values.votingMachine.values.votersReputationLossRatio.value
      // )
    );
  }, [votingMachines]);

  useEffect(() => {
    const updatedVotingMachines = votingMachines.map(
      (vm: GenesisProtocolForm, index: number) => {
        rewardSuccess
          ? (vm.$.proposingRepReward.value = presetVotingMachines[
              index
            ].proposingRepReward.toString())
          : (vm.$.proposingRepReward.value = "0");
        return vm;
      }
    );

    setVotingMachines(updatedVotingMachines);
  }, [rewardSuccess]);

  useEffect(() => {
    const updatedVotingMachines = votingMachines.map(
      (vm: GenesisProtocolForm, index: number) => {
        rewardAndPenVoters
          ? (vm.$.votersReputationLossRatio.value =
              presetVotingMachines[index].votersReputationLossRatio)
          : (vm.$.votersReputationLossRatio.value = 0); // LIB Not a string
        return vm;
      }
    );

    setVotingMachines(updatedVotingMachines);
  }, [rewardAndPenVoters]);

  useEffect(() => {
    const updatedVotingMachines = votingMachines.map(
      (vm: GenesisProtocolForm, index: number) => {
        autobet
          ? (vm.$.minimumDaoBounty.value = presetVotingMachines[
              index
            ].minimumDaoBounty.toString())
          : (vm.$.minimumDaoBounty.value = "0");
        return vm;
      }
    );

    setVotingMachines(updatedVotingMachines);
  }, [autobet]);

  // Updates voting machines on toggle
  const updateVotingMachine = () => {
    // Loops over each scheme on form
    // console.log("form.values", form.values);
    // form.$.forEach(checkDefaultChange);
    // form.$.forEach(getVotingMachinePreset);
  };

  const getVotingMachinePreset = (scheme: AnySchemeForm) => {
    // Get voting machine preset using the decisionSpeed and scheme type
    const schemePresetMap = schemeSpeeds.get(decisionSpeed);

    if (schemePresetMap === undefined)
      throw Error("Unimplemented Scheme Speed Configuration");

    // Initialize the scheme's voting machine to the Genesis Protocol Preset
    const votingMachine = scheme.$.votingMachine;
    votingMachine.preset = schemePresetMap.get(scheme.type);

    // VERIFIED
    if (!advanceMode) {
      // applyToggles(votingMachine);
      return;
    }

    const {
      proposingRepReward,
      votersReputationLossRatio,
      minimumDaoBounty
    } = votingMachine.$;

    // Update toggles to reflect advanced changes
    setRewardSuccess(+proposingRepReward.value > 0);
    setRewardAndPenVoters(votersReputationLossRatio.value > 0);
    setAutobet(+minimumDaoBounty.value > 0);
  };

  // const dependeciesList = [
  //   decisionSpeed,
  //   rewardSuccess,
  //   rewardAndPenVoters,
  //   autobet,
  //   advanceMode
  // ];

  // // Updates voting machines on toggle
  // useEffect(updateVotingMachine, dependeciesList);

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
