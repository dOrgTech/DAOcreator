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
import CustomStep from "./CustomStep";

export interface PieChartConfig {
  size: number;
  dataKey: string;
  nameKey: string;
}

export interface Props {
  //   changeFormInformation: any;
  // data: any[];
  // config: PieChartConfig;
}

function StepContainer() {
  return (
    <MDBContainer>
      <div className="row mt-1">
        <div className="col-md-12">
          <ul className="stepper stepper-vertical">
            {/* <CustomStep number="1" label="Primera Configuracion"></CustomStep> */}
          </ul>
        </div>
      </div>
    </MDBContainer>
  );
}

export default StepContainer;
