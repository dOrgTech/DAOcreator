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
import NamingStep from "../DAOcreatorV2/NamingStep";

export interface PieChartConfig {
  size: number;
  dataKey: string;
  nameKey: string;
}

export interface Props {
  number: string;
  label: string;
}

function CustomStep(props: Props) {
  return (
    <MDBContainer>
      <li className="completed">
        <a href="#!">
          <span className="circle">{props.number}</span>
          <span className="label">{props.label}</span>
        </a>
      </li>
    </MDBContainer>
  );
}

export default CustomStep;
