import * as React from "react";
import {
  DAOConfigForm,
  MembersForm,
  SchemesForm,
  DAOForm
} from "@dorgtech/daocreator-lib";
import { MDBBtn, MDBRow, MDBCollapse, MDBIcon } from "mdbreact";
interface Props {
  form?: DAOForm | DAOConfigForm | MembersForm | SchemesForm;
  Component: any;
  title: string;
  callbacks: any | undefined;
  step: Number;
  index: number;
}

export default function Accordion(props: Props) {
  const { form, title, Component, callbacks, step, index } = props;
  return (
    <li className={step === index || step > index ? "completed" : ""}>
      <MDBRow
        style={styles.specialRow}
        className="justify-content-space-between"
      >
        <a role="button">
          <span
            className="circle"
            style={step > index ? styles.circleActive : styles.noActive}
          >
            {index + 1}
          </span>
          <span
            className="label"
            style={step === index ? styles.active : styles.noActiveLabel}
          >
            {title}
          </span>
        </a>
        <a>
          <MDBBtn
            hidden={step === index || step < index}
            floating
            size="lg"
            color="transparent"
            className="btn"
            onClick={() => callbacks.setStep(index)}
            style={styles.icon}
          >
            <MDBIcon icon="pen" className="blue-text"></MDBIcon>
          </MDBBtn>
        </a>
      </MDBRow>

      <MDBCollapse id={index.toString()} isOpen={step.toString()}>
        <MDBRow className="justify-content-end" style={styles.stepContent}>
          <Component form={form} {...props.callbacks} />
        </MDBRow>
      </MDBCollapse>
    </li>
  );
}

const styles = {
  stepContent: {
    width: "100%",
    padding: "6px",
    margin: "0px 0px 0px 14%",
    border: "1px solid lightgray",
    borderRadius: "6px"
  },
  headerTop: {
    height: "30px"
  },
  titleContainer: {
    paddingBottom: "13px",
    borderBottom: "1px solid",
    borderColor: "inherit",
    marginRight: 0,
    marginLeft: 0
  },
  active: {
    fontWeight: 400,
    color: "#4285f4"
  },
  noActive: {
    color: "gray",
    backgroundColor: "white",
    borderColor: "white",
    border: "0.9px solid lightgray",
    fontWeight: 500
  },
  noActiveLabel: {
    color: "gray",
    fontWeight: 400
  },
  circleActive: {
    fontWeight: 400,
    color: "#ffffff !important",
    backgroundColor: "rgb(66, 133, 244) !important",
    borderColor: "white",
    border: "0.9px solid lightgray",
    background: "rgb(66, 133, 244) !important"
  },
  specialRow: {
    marginLeft: 0,
    marginRight: 0,
    width: "100%",
    justifyContent: "space-between"
  },
  icon: {
    background: "white",
    boxShadow: "none",
    color: "blue !important",
    padding: 5,
    height: 40,
    width: 40, //The Width must be the same as the height
    borderRadius: 400,
    border: "1px solid lightgrey"
  },
  completedStep: {
    fontWeight: 400,
    color: "#4285f4 !important",
    border: "0.9px solid #4285f4 !important",
    background: "white !important"
  }
};
