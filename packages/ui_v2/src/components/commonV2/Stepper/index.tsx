import React, { FC } from "react";
import {
  DAOConfigForm,
  MembersForm,
  SchemesForm,
  DAOForm
} from "@dorgtech/daocreator-lib";
import { MDBBtn, MDBRow, MDBCollapse } from "mdbreact";

import { UtilityButton } from "./UtilityButton";
import { MembersPreview, SchemesPreview, ConfigPreview } from "./Preview";
import './styles.css';

interface Props {
  index: number;
  form: DAOForm | DAOConfigForm | MembersForm | SchemesForm;
  Component: FC;
  title: string;
  callbacks: any;
  step: number;
  launching: boolean;
}

const ModalButton: FC<{
  step: number;
  index: number;
  setModal: (modal: boolean | string) => void; // TODO ?
}> = ({ step, index, setModal }) => {
  if (step === 1 && index === 1) {
    return <UtilityButton id='modal' title={"Advanced"} openModal={setModal} />;
  } else if (step === 2 && index === 2) {
    return <UtilityButton id='importCSV' title={"Import CSV"} openModal={setModal} />;
  }
  return <></>;
};

const Stepper: FC<Props> = ({
  index,
  form,
  title,
  Component,
  callbacks,
  step,
  launching
}) => {
  const StepIcon: FC<{ index: number; step: number }> = ({ index, step }) => (
    <a id="step" role="button" href="#/" style={{ cursor: "unset", padding: "30px" }}>
      <span
        className="circle"
        style={
          step < index
            ? styles.subsequentStepIcon
            : step === index
            ? styles.currentStepIcon
            : styles.previousStepIcon
        }
      >
        {index + 1}
      </span>
      <span
        id='label'
        className="label"
        style={step === index ? styles.active : styles.noActiveLabel}
      >
        {title}
      </span>
    </a>
  );

  let Preview;

  switch (index) {
    case 0:
      if (step === 0) break;

      // const { getDAOName, getDAOTokenSymbol } = callbacks;
      Preview = (
        <ConfigPreview
          daoName={callbacks.getDAOName()}
          daoSymbol={callbacks.getDAOTokenSymbol()}
        />
      );
      break;
    case 1:
      if (step <= 1) break;
      Preview = <SchemesPreview form={form as SchemesForm} />;
      break;
    case 2:
      if (step <= 2) break;

      // const { getDAOTokenSymbol } = callbacks;
      Preview = (
        <MembersPreview
          form={form as MembersForm}
          tokenSymbol={callbacks.getDAOTokenSymbol()}
        />
      );
      break;
    case 3:
      break;

    default:
      console.log("Index out of bounds");
      return null;
  }

  return (
    <li className={step >= index ? "completed" : ""}>

      <MDBRow
        style={styles.specialRow}
        className="justify-content-space-between"
      >
        <StepIcon index={index} step={step} />
        {Preview}
        <div>
          <ModalButton
            step={step}
            index={index}
            setModal={callbacks.setModal}
          />
          <MDBBtn
            hidden={step <= index}
            floating
            size="lg"
            color="transparent"
            className="btn"
            onClick={() => !launching && callbacks.setStep(index)}
            style={styles.icon}
            id="pencil"
          >
            <img src="icons/pencil.svg" alt="menu icon" />
          </MDBBtn>
        </div>
      </MDBRow>

      <MDBCollapse
        id={index.toString()}
        isOpen={step.toString()}
        style={styles.maxWidth}
      >
        <MDBRow
          id='row'
          className={
            index === (2 || 4) ? "justify-content-end" : "justify-content-start"
          }
          style={
            index === 0
              ? styles.stepContent
              : index === 1
              ? styles.stepTwoContent
              : index === 2 ?
              styles.stepThreeContent :
              styles.stepFourContent
          }
        >
          <Component form={form} {...callbacks} />
        </MDBRow>
      </MDBCollapse>
    </li>
  );
};


const styles = {
  stepContent: {
    width: 'auto',
    margin: '0px 5% 0px 12.5%',
    border: '1px solid lightgray',
    borderRadius: '6px',
    paddingLeft: '30px',
    paddingRight: '30px',
    paddingTop: '24px',
    paddingBottom: '24px'
  },
  stepTwoContent: {
    width: "inherit",
    padding: "6px",
    margin: "0px 5% 0px 12.5%",
    border: "1px solid lightgray",
    borderRadius: "6px",
    paddingLeft: '30px',
    paddingRight: '30px',
    paddingTop: '24px',
    paddingBottom: '24px'
  },
  stepThreeContent: {
    width: "auto",
    margin: "0px 5% 0px 12.5%",
    border: "1px solid lightgray",
    borderRadius: "6px",
    paddingTop: '24px',
    paddingBottom: '24px',
    paddingRight: '3px',
    paddingLeft: '3px'
  },
  stepFourContent: {
    width: "auto",
    padding: "16px",
    margin: "0px 5% 0px 12.5%",
    border: "1px solid lightgray",
    borderRadius: "6px",
    paddingLeft: '30px',
    paddingRight: '30px',
    paddingTop: '24px',
    paddingBottom: '24px'
  },
  active: {
    fontWeight: 400,
    color: '#1665D8', 
    marginLeft: '20px'
  },
  noActiveLabel: {
    color: "gray",
    fontWeight: 400,
    marginLeft: '20px'
  },
  previousStepIcon: {
    fontWeight: 400,
    // color: "#4285f4", // TODO background is being overridden
    backgroundColor: "white !important", // TODO Is being overridden
    border: "0.9px solid #1665D8 !important"
  },
  currentStepIcon: {
    fontWeight: 400,
    color: "white"
  },
  subsequentStepIcon: {
    fontWeight: 400,
    color: "grey",
    backgroundColor: "white",
    border: "0.9px solid lightgray"
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
    height: 35,
    width: 35, //The Width must be the same as the height
    borderRadius: 400,
    border: "1px solid rgb(238, 240, 255)",
    marginRight: "30px",
    marginTop: "16px"
  },
  maxWidth: {
    width: "-webkit-fill-available"
  }
};

export default Stepper;