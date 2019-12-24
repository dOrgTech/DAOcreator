import * as React from "react";
import { observer } from "mobx-react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTooltip,
  MDBIcon
} from "mdbreact";

import AdvanceSchemeEditor from "./AdvanceSchemeEditor";

interface Props {
  form: any;
  editable: boolean;
  nextStep: () => void;
  enabled?: boolean;
  onToggle?: (toggled: boolean) => void;
}

type decisionSpeed = "slow" | "medium" | "fast";

function SchemeEditor(props: Props) {
  const { form, nextStep } = props;
  const [distributionEnabled, setDistributionEnabled] = React.useState<boolean>(
    false
  );
  const [rewardPropEnabled, setRewardPropEnabled] = React.useState<boolean>(
    false
  );
  const [rewardVoterEnabled, setRewardVoterEnabled] = React.useState<boolean>(
    false
  );
  const [penalizeEnabled, setPenalizeEnabled] = React.useState<boolean>(false);
  const [autobetEnabled, setAutobetEnabled] = React.useState<boolean>(false);
  const [decisionSpeed, setDecisionSpeed] = React.useState<decisionSpeed>(
    "medium"
  );
  const [formInformation, setFormInformation] = React.useState<any>({});

  const changeFormInformation = (modalInfo: any) =>
    setFormInformation(modalInfo);

  const handleClick = (e: any) => setDecisionSpeed(e.target.value);
  const showState = () => {
    if (form.$.length > 0) {
      nextStep();
    } else {
      const states = {
        distributionEnabled,
        rewardPropEnabled,
        rewardVoterEnabled,
        penalizeEnabled,
        autobetEnabled,
        decisionSpeed,
        formInformation
      };
      console.log(states);
    }
  };
  return (
    <>
      <MDBContainer>
        <MDBRow>
          <MDBCol md="4"></MDBCol>
          <MDBCol md="4" className="offset-md-4">
            <AdvanceSchemeEditor
              form={form}
              changeFormInformation={changeFormInformation}
            />
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol>
            <p className="text-left">Recommend Configuration</p>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol>
            <p className="text-left">
              Your proposal uses a proposal-vote structure and can securely
              scale to a big organization
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
                value="fast"
                outline={!(decisionSpeed === "fast")}
                style={styles.buttonColor}
                onClick={handleClick}
              >
                Fast
              </MDBBtn>
              <MDBBtn
                color="blue darken-4"
                size="sm"
                name="decisonSpeed"
                value="medium"
                style={styles.buttonColor}
                outline={!(decisionSpeed === "medium")}
                onClick={handleClick}
              >
                Medium
              </MDBBtn>
              <MDBBtn
                color="blue darken-4"
                size="sm"
                name="decisonSpeed"
                value="slow"
                style={styles.buttonColor}
                outline={!(decisionSpeed === "slow")}
                onClick={handleClick}
              >
                Slow
              </MDBBtn>
            </MDBRow>
          </MDBCol>
        </MDBRow>

        <MDBRow style={styles.paddingRow}>
          <MDBCol size="10" style={styles.noPadding}>
            <span style={styles.marginText} className="text-left">
              Distribute Dxdao token
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
          </MDBCol>
          <MDBCol>
            <div className="custom-control custom-switch">
              <input
                type="checkbox"
                className="custom-control-input"
                id="distributionEnabled"
                onChange={() => setDistributionEnabled(!distributionEnabled)}
                readOnly
              />
              <label
                className="custom-control-label"
                htmlFor="distributionEnabled"
              ></label>
            </div>
          </MDBCol>
        </MDBRow>

        <MDBRow style={styles.paddingRow}>
          <MDBCol size="10" style={styles.noPadding}>
            <span style={styles.marginText} className="text-left">
              Reward successful proposer
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
          </MDBCol>
          <MDBCol>
            <div className="custom-control custom-switch">
              <input
                type="checkbox"
                className="custom-control-input"
                id="rewardPropEnabled"
                readOnly
                onChange={() => setRewardPropEnabled(!rewardPropEnabled)}
              />
              <label
                className="custom-control-label"
                htmlFor="rewardPropEnabled"
              ></label>
            </div>
          </MDBCol>
        </MDBRow>

        <MDBRow style={styles.paddingRow}>
          <MDBCol size="10" style={styles.noPadding}>
            <span style={styles.marginText} className="text-left">
              Reward voters who side with the mayority
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
          </MDBCol>
          <MDBCol>
            <div className="custom-control custom-switch">
              <input
                type="checkbox"
                className="custom-control-input"
                id="rewardVoterEnabled"
                readOnly
                onChange={() => setRewardVoterEnabled(!rewardVoterEnabled)}
              />
              <label
                className="custom-control-label"
                htmlFor="rewardVoterEnabled"
              ></label>
            </div>
          </MDBCol>
        </MDBRow>

        <MDBRow style={styles.paddingRow}>
          <MDBCol size="10" style={styles.noPadding}>
            <span style={styles.marginText} className="text-left">
              Penalize voters who side against the mayority
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
          </MDBCol>
          <MDBCol>
            <div className="custom-control custom-switch">
              <input
                type="checkbox"
                className="custom-control-input"
                id="penalizeEnabled"
                readOnly
                onChange={() => setPenalizeEnabled(!penalizeEnabled)}
              />
              <label
                className="custom-control-label"
                htmlFor="penalizeEnabled"
              ></label>
            </div>
          </MDBCol>
        </MDBRow>

        <MDBRow style={styles.paddingRow}>
          <MDBCol size="10" style={styles.noPadding}>
            <span style={styles.marginText} className="text-left">
              Auto-bet against every proposal to incentive curation of valuable
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
          </MDBCol>
          <MDBCol>
            <div className="custom-control custom-switch">
              <input
                type="checkbox"
                className="custom-control-input"
                id="autobetEnabled"
                readOnly
                onChange={() => setAutobetEnabled(!autobetEnabled)}
              />
              <label
                className="custom-control-label"
                htmlFor="autobetEnabled"
              ></label>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      <MDBBtn
        color="blue darken-4"
        onClick={showState}
        style={styles.configButton}
      >
        Set Configuration
      </MDBBtn>
    </>
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
