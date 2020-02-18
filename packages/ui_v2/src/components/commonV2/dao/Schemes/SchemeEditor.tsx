import React, { useState, useEffect, FC, useRef } from "react";
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
  GenesisProtocolForm,
  ContributionRewardForm,
  SchemeRegistrarForm,
  GenericSchemeForm
} from "@dorgtech/daocreator-lib";

import AdvancedEditor from "./AdvancedEditor";
import Toggle from "./Toggle";

interface Props {
  form: SchemesForm;
  toggleCollapse: () => void;
  modal: boolean;
  setModal: (modal: boolean) => void;
}

export type VotingMachinePresets = [
  GenesisProtocolForm,
  GenesisProtocolForm,
  GenesisProtocolForm
];

enum DAOSpeed {
  Slow,
  Medium,
  Fast
}

const schemeTemplates: AnySchemeForm[] = [
  new ContributionRewardForm(),
  new SchemeRegistrarForm(),
  new GenericSchemeForm()
];

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
  /*
  / State
  */

  const [decisionSpeed, setDecisionSpeed] = useState<DAOSpeed>(DAOSpeed.Medium);
  // Toggles
  const [rewardSuccess, setRewardSuccess] = useState(true);
  const [rewardAndPenVoters, setRewardAndPenVoters] = useState(true);
  const [autobet, setAutobet] = useState(true);

  // Voting Machines
  const [votingMachines, setVotingMachines] = useState<GenesisProtocolForm[]>([
    schemeTemplates[0].$.votingMachine,
    schemeTemplates[1].$.votingMachine
  ]);
  const [activeSchemeTypes, setActiveSchemeTypes] = useState<SchemeType[]>([
    SchemeType.ContributionReward,
    SchemeType.SchemeRegistrar
  ]);
  const [presetVotingMachines, setPresetVotingMachines] = useState<
    VotingMachinePresets
  >([
    schemeTemplates[0].$.votingMachine,
    schemeTemplates[1].$.votingMachine,
    schemeTemplates[2].$.votingMachine
  ]);

  // Ref to stop force switching toggles from updating vm
  const updatingVotingMachine = useRef(false);

  /*
   * Hooks
   */

  // Sets vm and vm presets when the speed is changed
  useEffect(() => {
    const vms: GenesisProtocolForm[] = [];
    const vmPresets: GenesisProtocolForm[] = [];

    schemeTemplates.map((scheme: AnySchemeForm) => {
      // Gets voting machine preset using the decisionSpeed and scheme type
      const schemePresetMap = schemeSpeeds.get(decisionSpeed);

      if (schemePresetMap === undefined)
        throw Error("Unimplemented Scheme Speed Configuration");

      const preset = schemePresetMap.get(scheme.type);
      if (preset === undefined) throw Error("Preset not found");

      const vm: GenesisProtocolForm = scheme.$.votingMachine;
      vm.preset = preset;

      vms.push(vm);
      vmPresets.push(vm);

      return scheme;
    });

    setVotingMachines(vms);
    setPresetVotingMachines(
      vmPresets as [
        GenesisProtocolForm,
        GenesisProtocolForm,
        GenesisProtocolForm
      ]
    );
  }, [decisionSpeed]);

  const discardPreset = (scheme: AnySchemeForm) => {
    const schemePresetMap = schemeSpeeds.get(decisionSpeed);

    if (schemePresetMap === undefined)
      throw Error("Unimplemented Scheme Speed Configuration");

    const preset = schemePresetMap.get(scheme.type);
    if (preset === undefined) throw Error(`Preset: ${scheme.type} not found`);

    const presetVM = new GenesisProtocolForm({ preset });

    if (
      Object.entries(presetVM.values).toString() ===
      Object.entries(scheme.$.votingMachine.values).toString()
    )
      return false;
    return true;
  };

  // Updates form when vm changes
  useEffect(() => {
    const newForm = new SchemesForm();
    activeSchemeTypes.map((type: SchemeType, index: number) => {
      switch (type) {
        case SchemeType.ContributionReward:
          newForm.$.push(new ContributionRewardForm());
          break;
        case SchemeType.SchemeRegistrar:
          newForm.$.push(new SchemeRegistrarForm());
          break;
        case SchemeType.GenericScheme:
          newForm.$.push(new GenericSchemeForm());
          break;
        default:
          throw new Error("Unimplemented scheme type");
      }
      newForm.$[index].$.votingMachine = votingMachines[index];
      if (discardPreset(newForm.$[index]))
        newForm.$[index].$.votingMachine.preset = undefined;

      return type;
    });

    form.$ = newForm.$;

    return () => {
      updatingVotingMachine.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [votingMachines, activeSchemeTypes]);

  // Updates vms when toggles change
  useEffect(() => {
    if (updatingVotingMachine.current) return;
    setVotingMachines(
      votingMachines.map((vm: GenesisProtocolForm, index: number) => {
        rewardSuccess
          ? (vm.$.proposingRepReward =
              presetVotingMachines[index].$.proposingRepReward)
          : (vm.$.proposingRepReward.value = "0");
        return vm;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewardSuccess, presetVotingMachines]);
  useEffect(() => {
    if (updatingVotingMachine.current) return;
    setVotingMachines(
      votingMachines.map((vm: GenesisProtocolForm, index: number) => {
        rewardAndPenVoters
          ? (vm.$.votersReputationLossRatio =
              presetVotingMachines[index].$.votersReputationLossRatio)
          : (vm.$.votersReputationLossRatio.value = 0); // LIB Not a string
        return vm;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewardAndPenVoters, presetVotingMachines]);
  useEffect(() => {
    if (updatingVotingMachine.current) return;
    setVotingMachines(
      votingMachines.map((vm: GenesisProtocolForm, index: number) => {
        autobet
          ? (vm.$.minimumDaoBounty =
              presetVotingMachines[index].$.minimumDaoBounty)
          : (vm.$.minimumDaoBounty.value = "0");
        return vm;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autobet, presetVotingMachines]);

  /*
   * Methods
   */

  const updateVotingMachines = (advancedVMSchemes: AnySchemeForm[]) => {
    updatingVotingMachine.current = true;

    let advancedVms: GenesisProtocolForm[] = [];
    let activeAdvSchemeTypes: SchemeType[] = [];

    advancedVMSchemes.map((scheme: AnySchemeForm, index: number) => {
      const vm = scheme.$.votingMachine;
      advancedVms.push(vm);
      activeAdvSchemeTypes.push(scheme.type);

      // Currently only updates toggles to reflect advanced changes of first scheme
      if (index !== 0) return vm;

      const {
        proposingRepReward,
        votersReputationLossRatio,
        minimumDaoBounty
      } = vm.values;

      setRewardSuccess(+proposingRepReward > 0);
      setRewardAndPenVoters(votersReputationLossRatio > 0);
      setAutobet(+minimumDaoBounty > 0);

      return vm;
    });

    setVotingMachines(advancedVms);
    setActiveSchemeTypes(activeAdvSchemeTypes);
  };

  const resetForm = () => {
    const newForm: AnySchemeForm[] = [
      new ContributionRewardForm(),
      new SchemeRegistrarForm()
    ];

    form.$ = newForm;
  };

  const handleClick = (e: any) => {
    setDecisionSpeed(parseInt(e.target.value));
  };

  return (
    <>
      <MDBContainer style={styles.paddingContainer}>
        <MDBRow>
          <MDBCol md="4"></MDBCol>
          <MDBCol md="4" className="offset-md-4">
            <AdvancedEditor
              form={form}
              defaultVMs={presetVotingMachines}
              updateVotingMachines={updateVotingMachines}
              resetForm={resetForm}
              setModal={setModal}
              modal={modal}
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
          checked={rewardAndPenVoters}
        />

        <Toggle
          id={"autobet"}
          text={"Auto-bet against every proposal to incentivise curation"}
          tooltip={
            "The organization bets against every proposal to incentivize the GEN curation network"
          }
          toggle={() => setAutobet(!autobet)}
          checked={autobet}
        />
      </MDBContainer>

      <button onClick={toggleCollapse} style={styles.configButton}>
        Set Configuration
      </button>
    </>
  );
};

const styles = {
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

export default SchemeEditor;
