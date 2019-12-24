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
import ModalConfig from "../Modal";

interface Props {
  form: any;
  editable: boolean;
  enabled: boolean;
  onToggle: (toggled: boolean) => void;
}

type decisionSpeed = "slow" | "medium" | "fast";

function SchemeEditor(props: Props) {
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
  const [formInformation, setFormInformation] = React.useState<any>({});
  const [decisionSpeed, setDecisionSpeed] = React.useState<decisionSpeed>(
    "medium"
  );

  const changeFormInformation = (modalInfo: any) =>
    setFormInformation(modalInfo);
  // const changeFormInformation = (modalInfo: any) => console.log(modalInfo);
  const handleClick = (e: any) => setDecisionSpeed(e.target.value);
  const showState = () => {
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
  };
  return (
    <>
      <MDBContainer style={styles.paddingContainer}>
        <MDBRow>
          <MDBCol md="4"></MDBCol>
          <MDBCol md="4" className="offset-md-4">
            <ModalConfig
            // changeFormInformation={changeFormInformation}
            ></ModalConfig>
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
              scale to a big organisation
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
                value="fast"
                style={
                  !(decisionSpeed === "fast")
                    ? styles.buttonColor
                    : styles.buttonColorActive
                }
                onClick={handleClick}
              >
                Fast
              </button>
              <button
                name="decisonSpeed"
                value="medium"
                style={
                  !(decisionSpeed === "medium")
                    ? styles.buttonColor
                    : styles.buttonColorActive
                }
                onClick={handleClick}
              >
                Medium
              </button>
              <button
                name="decisonSpeed"
                value="slow"
                style={
                  !(decisionSpeed === "slow")
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

        <MDBRow style={styles.paddingRow}>
          <MDBCol size="11" style={styles.noPadding}>
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
          <MDBCol style={styles.noPadding}>
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
          <MDBCol size="11" style={styles.noPadding}>
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
          <MDBCol style={styles.noPadding}>
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
          <MDBCol size="11" style={styles.noPadding}>
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
          <MDBCol style={styles.noPadding}>
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
          <MDBCol size="11" style={styles.noPadding}>
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
          <MDBCol style={styles.noPadding}>
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
          <MDBCol size="11" style={styles.noPadding}>
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
          <MDBCol style={styles.noPadding}>
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
        <MDBRow>
          <button
            color="blue darken-4"
            onClick={showState}
            style={styles.configButton}
          >
            Set Configuration
          </button>
        </MDBRow>
      </MDBContainer>
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
    padding: "21px"
  }
};

export default observer(SchemeEditor);
