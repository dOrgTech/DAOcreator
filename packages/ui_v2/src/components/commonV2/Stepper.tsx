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
  daoName?: string;
}

export default function Stepper(props: Props) {
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
            style={
              step > index
                ? styles.circleActive
                : styles.noActive || step === index
                ? styles.circleActive
                : styles.noActive
            }
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
        {step > 0 && index === 0 && callbacks.daoName() ? (
          <p style={{ marginTop: "26px" }}>{callbacks.daoName()}</p>
        ) : (
          ""
        )}
        <div>
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
        </div>
      </MDBRow>

      <MDBCollapse
        id={index.toString()}
        isOpen={step.toString()}
        style={styles.maxWidth}
      >
        <MDBRow
          className={
            index === (2 || 4) ? "justify-content-end" : "justify-content-start"
          }
          style={
            index === (1 || 3)
              ? styles.stepContent
              : styles.stepTwoContent && index === 2
              ? styles.stepTwoContent
              : styles.stepFourContent
          }
        >
          <Component form={form} {...props.callbacks} />
        </MDBRow>
      </MDBCollapse>
    </li>
  );
}

const styles = {
  stepContent: {
    width: "fit-content",
    padding: "6px",
    margin: "0px 5% 0px 14%",
    border: "1px solid lightgray",
    borderRadius: "6px"
  },
  stepTwoContent: {
    width: "inherit",
    padding: "6px",
    margin: "0px 5% 0px 14%",
    border: "1px solid lightgray",
    borderRadius: "6px"
  },
  stepFourContent: {
    width: "auto",
    padding: "16px",
    margin: "0px 5% 0px 14%",
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
    color: "white",
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
  },
  maxWidth: {
    width: "-webkit-fill-available"
  }
};
