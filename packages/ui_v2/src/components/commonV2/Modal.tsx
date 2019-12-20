import * as React from "react";
import {
  Chart,
  PieSeries,
  Tooltip
} from "@devexpress/dx-react-chart-material-ui";
import { Animation, EventTracker } from "@devexpress/dx-react-chart";
import {
  MDBContainer,
  MDBBtn,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBIcon,
  MDBTabContent,
  MDBTabPane,
  MDBRow,
  MDBCol,
  MDBTooltip
} from "mdbreact";
import { Component, Fragment } from "react";

export interface PieChartConfig {
  size: number;
  dataKey: string;
  nameKey: string;
}

export interface Props {
  data: any[];
  config: PieChartConfig;
}

interface State {
  targetItem: any;
}

class ModalConfig extends Component {
  state = {
    modal: false,
    activeItemJustified: "1"
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  render() {
    return (
      <Fragment>
        <MDBBtn
          outline
          //   color="black"
          style={styles.button}
          onClick={this.toggle}
        >
          Advance Configuration
        </MDBBtn>
        <MDBModal
          isOpen={this.state.modal}
          toggle={this.toggle}
          style={styles.modal}
          size="lg"
        >
          <MDBModalHeader toggle={this.toggle}>
            Advance Configuration
          </MDBModalHeader>
          <MDBModalBody>
            <MDBRow style={styles.rowTab}>
              <MDBCol style={styles.tab}>
                <button style={styles.buttonTab}>Contribution Reward</button>
              </MDBCol>
              <MDBCol style={styles.tab}>
                <button style={styles.buttonTab}>Scheme Registry</button>
              </MDBCol>
              <MDBCol style={styles.tab}>
                <button style={styles.buttonTab}>Generic Scheme</button>
              </MDBCol>
            </MDBRow>

            <MDBRow style={styles.borderRow}>
              <MDBCol>
                <span>Deploy Contribution Reward Sheme</span>
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
                    id="autobetEnabled"
                    readOnly
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="autobetEnabled"
                  ></label>
                </div>
              </MDBCol>
            </MDBRow>

            <MDBRow style={styles.paddingRow}>
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
                  name="quantity"
                  min="1"
                  max="5"
                  placeholder="16"
                />
                <input
                  style={styles.date}
                  type="time"
                  id="appt"
                  name="appt"
                  min="09:00"
                  max="18:00"
                  required
                ></input>
              </MDBCol>
            </MDBRow>
            <MDBRow style={styles.paddingRow}>
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
                  min="1"
                  max="5"
                  placeholder="16"
                />
                <input
                  style={styles.date}
                  type="time"
                  id="appt"
                  name="appt"
                  min="09:00"
                  max="18:00"
                  required
                ></input>
              </MDBCol>
            </MDBRow>
            <MDBRow style={styles.paddingRow}>
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
                  name="quantity"
                  min="1"
                  max="5"
                  placeholder="16"
                />
                <input
                  style={styles.date}
                  type="time"
                  id="appt"
                  name="appt"
                  min="09:00"
                  max="18:00"
                  required
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
                  name="quantity"
                  min="1"
                  max="5"
                  placeholder="16"
                />
                <input
                  style={styles.date}
                  type="time"
                  id="appt"
                  name="appt"
                  min="09:00"
                  max="18:00"
                  required
                ></input>
              </MDBCol>
            </MDBRow>
            <MDBRow center style={styles.lastRow}>
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
                  name="quantity"
                  min="1"
                  max="5"
                  placeholder="16"
                />
                <input
                  style={styles.date}
                  type="time"
                  id="appt"
                  name="appt"
                  min="09:00"
                  max="18:00"
                  required
                ></input>
              </MDBCol>
            </MDBRow>

            <MDBRow center style={styles.paddingRow}>
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
                <input type="text" id="Name" name="Name" />
              </MDBCol>
              <MDBCol size="6" style={styles.save}>
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
                <input type="text" id="Name" name="Name" />
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
                <input type="text" id="Name" name="Name" />
              </MDBCol>
              <MDBCol size="6" style={styles.save}>
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
                <input type="text" id="Name" name="Name" />
              </MDBCol>
            </MDBRow>

            <MDBRow style={styles.paddingRow}>
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
                  id="start"
                  name="trip-start"
                  value="2019-07-22"
                  min="2018-01-01"
                  max="2018-12-31"
                />
              </MDBCol>
            </MDBRow>

            <MDBRow center style={styles.paddingRow}>
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
                <input type="text" id="Name" name="Name" />
              </MDBCol>
            </MDBRow>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBRow style={styles.buttonsRow}>
              <MDBCol size="6">
                <MDBBtn color="secondary" onClick={this.toggle}>
                  Close
                </MDBBtn>
              </MDBCol>
              <MDBCol style={styles.save}>
                <MDBBtn color="primary">Save changes</MDBBtn>
              </MDBCol>
            </MDBRow>
          </MDBModalFooter>
        </MDBModal>
      </Fragment>
    );
  }
}

const styles = {
  button: {
    width: "inherit",
    height: "42px",
    /* text-align: start; */
    padding: 0
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
  }
};

export default ModalConfig;
