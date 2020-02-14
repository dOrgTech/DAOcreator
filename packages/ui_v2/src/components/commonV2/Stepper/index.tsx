import React, { FC } from "react";
import {
  DAOConfigForm,
  MembersForm,
  SchemesForm,
  DAOForm
} from "@dorgtech/daocreator-lib";
import { MDBBtn, MDBRow, MDBCollapse, MDBIcon, MDBCol } from "mdbreact";

import { UtilityButton } from "./UtilityButton";
import { simpleOptionsSwitcher } from "../../utils";
import { MembersPreview } from "./Preview";

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
  setModal: any;
}> = ({ step, index, setModal }) => {
  if (step === 1 && index === 1) {
    return <UtilityButton title={"Advanced"} openModal={setModal} />;
  } else if (step === 2 && index === 2) {
    return <UtilityButton title={"Import CSV"} openModal={setModal} />;
  }
  return <></>;
};

const SimpleConfigTextform: FC<{ form: SchemesForm }> = ({ form }) => {
  const simpleOptions = simpleOptionsSwitcher(form, true);
  const noDuplicateSimpleOptions = simpleOptions.slice(
    0,
    simpleOptions.length / 2
  );
  return (
    <div style={styles.schemePreview}>
      <p>
        <strong>Recommended</strong>
      </p>
      {noDuplicateSimpleOptions.map((option: any, index: number) =>
        option.checked ? (
          <div key={index}>
            <p>
              <MDBIcon icon="check" className="blue-text" /> {option.text}
            </p>
          </div>
        ) : (
          <div key={index}>
            <p>
              <MDBIcon icon="times" className="grey-text" /> {option.text}
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default function Stepper({
  index,
  form,
  title,
  Component,
  callbacks,
  step,
  launching
}: Props) {
  return (
    <li className={step === index || step > index ? "completed" : ""}>
      <MDBRow
        style={styles.specialRow}
        className="justify-content-space-between"
      >
        <a role="button" href="#/" style={{ cursor: "unset" }}>
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
            className="label"
            style={step === index ? styles.active : styles.noActiveLabel}
          >
            {title}
          </span>
        </a>
        {step > 0 && index === 0 && callbacks.getDAOName() && (
          <MDBRow
            style={{
              marginTop: "26px",
              marginRight: "auto",
              marginLeft: "1.5rem",
              whiteSpace: "nowrap"
            }}
          >
            <MDBCol>
              <span>
                Name: <strong>{callbacks.getDAOName()}</strong>
              </span>
            </MDBCol>
            <MDBCol>
              <span>
                Symbol: <strong>{callbacks.getDAOTokenSymbol()}</strong>
              </span>
            </MDBCol>
          </MDBRow>
        )}
        {step > 1 && index === 1 && (
          <SimpleConfigTextform form={form as SchemesForm} />
        )}
        {step > 2 && index === 2 && (
          <MembersPreview
            form={form as MembersForm}
            tokenSymbol={callbacks.getDAOTokenSymbol()}
          />
        )}
        <div>
          <ModalButton
            step={step}
            index={index}
            setModal={callbacks.setModal}
          />
          <MDBBtn
            hidden={step === index || step < index}
            floating
            size="lg"
            color="transparent"
            className="btn"
            onClick={() => !launching && callbacks.setStep(index)}
            style={styles.icon}
          >
            <MDBIcon
              icon="pen"
              className={launching ? "grey-text" : "blue-text"}
            />
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
          <Component form={form} {...callbacks} />
        </MDBRow>
      </MDBCollapse>
    </li>
  );
}

const styles = {
  stepContent: {
    width: "fit-content",
    padding: "6px",
    margin: "0px 5% 0px 9%",
    border: "1px solid lightgray",
    borderRadius: "6px"
  },
  stepTwoContent: {
    width: "inherit",
    padding: "6px",
    margin: "0px 5% 0px 9%",
    border: "1px solid lightgray",
    borderRadius: "6px"
  },
  stepFourContent: {
    width: "auto",
    padding: "16px",
    margin: "0px 5% 0px 9%",
    border: "1px solid lightgray",
    borderRadius: "6px"
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
  previousStepIcon: {
    fontWeight: 400,
    // color: "#4285f4", // TODO background is being overridden
    backgroundColor: "white !important", // TODO Is being overridden
    border: "0.9px solid #4285f4"
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
    height: 40,
    width: 40, //The Width must be the same as the height
    borderRadius: 400,
    border: "1px solid lightgrey",
    marginRight: "30px",
    marginTop: "16px"
  },
  completedStep: {
    fontWeight: 400,
    color: "#4285f4 !important",
    border: "0.9px solid #4285f4 !important",
    background: "white !important"
  },
  maxWidth: {
    width: "-webkit-fill-available"
  },
  schemePreview: {
    marginTop: 28
  }
};
