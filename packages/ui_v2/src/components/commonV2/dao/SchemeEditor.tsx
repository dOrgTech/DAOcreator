import React, { useState } from "react";
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
  Scheme,
  SchemeType,
  GenesisProtocolPreset,
  ContributionRewardForm,
  SchemeRegistrarForm
} from "@dorgtech/daocreator-lib";

interface Props {
  form: any;
  editable: boolean;
  enabled: boolean;
  onToggle: (toggled: boolean) => void;
}

enum DAOSpeed {
  Slow,
  Medium,
  Fast
}

function SchemeEditor(props: Props) {
  const { form } = props;
  const [decisionSpeed, setDecisionSpeed] = useState<DAOSpeed>(DAOSpeed.Medium);
  const [distribution, setDistribution] = useState<boolean>(false);
  const [rewardSuccess, setRewardSuccess] = useState<boolean>(false);
  const [rewardAndPenVoters, setRewardAndPenVoters] = useState<boolean>(false);
  const [autobet, setAutobet] = useState<boolean>(false);

  const debug = () => {
    configureVotingMachine();
    const states = {
      decisionSpeed,
      distribution,
      rewardSuccess,
      rewardAndPenVoters,
      autobet
    };
    console.log(states);
  };

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

  const configureVotingMachine = () => {
    //console.log(daoForm);

    //console.log(form.$);
    //Looks like props.daoForm.schemes are equal to props.form
    //form.map((scheme: any) => {
    daoForm.$.schemes.$.forEach(scheme => {
      const preset = schemeSpeeds[decisionSpeed][scheme.type];
      // console.log("preset:");
      // console.log(preset);
      if (preset === undefined) {
        throw Error("Unimplemented Scheme Speed Configuration");
      }

      const votingMachine = scheme.$.votingMachine; // Is voting machine a pre existing property?

      // Initialize the scheme's voting machine to the Genesis Protocol Preset
      votingMachine.preset = preset;

      // Apply the effects of the toggles
      //if(!distribution)

      if (!rewardSuccess) {
        votingMachine.$.proposingRepReward.value = "0";
      }
      if (!rewardAndPenVoters) {
        votingMachine.$.votersReputationLossRatio.value = 0;
      }
      if (!autobet) {
        votingMachine.$.minimumDaoBounty.value = "0";
      }

      console.log("votingMachine");
      console.log(votingMachine);
    });
  };

  const handleClick = (e: any) => {
    setDecisionSpeed(parseInt(e.target.value));
  };

  return (
    <>
      <MDBContainer>
        <MDBRow>
          <MDBCol>
            <p className="text-left">Recommend Configuration</p>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol>
            <p className="text-left">
              Your proposal uses a proposal-vote structure and can securely
              scale to a big organisation
            </p>
          </MDBCol>
        </MDBRow>

        <MDBRow style={styles.box}>
          <MDBCol size="3">
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
              <MDBBtn
                color="blue darken-4"
                size="sm"
                name="decisonSpeed"
                value={DAOSpeed.Slow}
                style={styles.buttonColor}
                outline={!(decisionSpeed === DAOSpeed.Slow)}
                onClick={handleClick}
              >
                Fast
              </MDBBtn>
              <MDBBtn
                color="blue darken-4"
                size="sm"
                name="decisonSpeed"
                value={DAOSpeed.Medium}
                style={styles.buttonColor}
                outline={!(decisionSpeed === DAOSpeed.Medium)}
                onClick={handleClick}
              >
                Medium
              </MDBBtn>
              <MDBBtn
                color="blue darken-4"
                size="sm"
                name="decisonSpeed"
                value={DAOSpeed.Fast}
                style={styles.buttonColor}
                outline={!(decisionSpeed === DAOSpeed.Fast)}
                onClick={handleClick}
              >
                Slow
              </MDBBtn>
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
        />

        <Toggleable
          id={"rewardSuccess"}
          text={"Reward successful proposer"}
          example={"Some example"}
          toggle={() => {
            setRewardSuccess(!rewardSuccess);
          }}
        />

        <Toggleable
          id={"rewardAndPenVoters"}
          text={"Reward correct voters and penalize incorrect voters"}
          example={"Some example"}
          toggle={() => {
            setRewardAndPenVoters(!rewardAndPenVoters);
          }}
        />

        <Toggleable
          id={"autobet"}
          text={"Auto-bet against every proposal to incentivise curation"}
          example={"Some example"}
          toggle={() => setAutobet(!autobet)}
        />
      </MDBContainer>

      <MDBBtn color="blue darken-4" onClick={debug} style={styles.configButton}>
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
}

function Toggleable({ id, text, example, toggle }: ToggleProps) {
  return (
    <MDBRow style={styles.paddingRow}>
      <MDBCol size="10" style={styles.noPadding}>
        <span style={styles.marginText} className="text-left">
          {text}
        </span>
        <MDBTooltip placement="bottom" clickable>
          <MDBBtn floating size="lg" color="transparent" style={styles.info}>
            <MDBIcon icon="info-circle" />
          </MDBBtn>
          <span>{example}</span>
        </MDBTooltip>
      </MDBCol>
      <MDBCol>
        <div className="custom-control custom-switch">
          <input
            type="checkbox"
            className="custom-control-input"
            id={id}
            onChange={() => toggle()}
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
    color: "#fff",
    /* background-color: #4285f4 !important; */
    backgroundColor: "#3182ce !important",
    borderRadius: "0.25rem",
    fontWeight: 600,
    width: "28%",
    padding: "5px !important",
    height: "38px"
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
    marginTop: "6px"
  },
  alignEnd: {
    flexDirection: "row-reverse"
  },
  paddingRow: {
    padding: "10px"
  },
  noPadding: {
    padding: 0
  },
  configButton: {
    borderRadius: "0.37rem",
    fontWeight: 700
  }
};

export default observer(SchemeEditor);
