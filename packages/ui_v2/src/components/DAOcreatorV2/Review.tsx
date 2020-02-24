import React, { FC } from "react";
import { MDBRow, MDBCol, MDBIcon } from "mdbreact";
import LineGraphic from "../commonV2/LineGraphic";
import { getSimpleOptions, SimpleOption } from "../utils";
import { DAOForm } from "@dorgtech/daocreator-lib";
import { StepNum } from ".";

const FirstStep = (form: any) => {
  const { daoName, tokenSymbol } = form.$.config.$;
  return (
    <div>
      <h3>Config</h3>
      <MDBRow style={styles.first.row}>
        <MDBCol>
          <span>
            Name: <strong>{daoName.value}</strong>
          </span>
        </MDBCol>
        <MDBCol>
          <span>
            Symbol: <strong>{tokenSymbol.value}</strong>
          </span>
        </MDBCol>
      </MDBRow>
    </div>
  );
};

const SecondStep = (form: any) => (
  <div style={styles.second.container}>
    <h3>Schemes</h3>
    {getSimpleOptions(form.$.schemes).map(
      ({ text, checked }: SimpleOption, index: number) => (
        <div key={index}>
          <p>
            <MDBIcon
              icon={checked ? "check" : "times"}
              className={checked ? "blue-text" : "red-text"}
              style={
                checked ? styles.second.checked : styles.second.unchecked // x icon is smaller
              }
            />
            {text}
          </p>
        </div>
      )
    )}
  </div>
);

const ThirdStep = (form: any) => {
  const reputationConfig = {
    showPercentage: false,
    height: "0.5rem",
    symbol: "REP",
    dataKey: "reputation",
    nameKey: "address"
  };
  const tokenConfig = {
    showPercentage: false,
    height: "0.5rem",
    symbol: "token", // TODO get token symbol (?)
    dataKey: "tokens",
    nameKey: "address"
  };
  let totalReputationAmount = 0;
  let totalTokenAmount = 0;
  const { config, members } = form.$;
  const { daoName } = config.$;
  members.toState().map((member: any) => {
    totalReputationAmount += member.reputation;
    totalTokenAmount += member.tokens;
    return null;
  });
  const numberOfMembers = members.$.length;
  const membersTokenCount = (count: any, member: any) =>
    +member.$.tokens.value + count;
  const hasTokens = members.$.reduce(membersTokenCount, 0) > 0;
  return (
    <div style={styles.third.container}>
      <h3>Members</h3>
      <p>
        {numberOfMembers} Member{numberOfMembers > 1 ? "s" : ""}
      </p>
      <div style={styles.third.reputationDistribution}>
        <p>Reputation Distribution</p>
        <LineGraphic
          data={members.toState()}
          total={totalReputationAmount}
          config={reputationConfig}
          style={styles.third.lineGraphic}
        />
      </div>
      {hasTokens ? (
        <>
          <div style={styles.third.hasTokens}>
            <p>{daoName.value} Token Distribution</p>
            <LineGraphic
              data={members.toState()}
              total={totalTokenAmount}
              config={tokenConfig}
              style={styles.third.lineGraphic}
            />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

const steps = [FirstStep, SecondStep, ThirdStep];

interface Props {
  furthestStep: StepNum;
  recoveredForm: DAOForm;
}

export const Review: FC<Props> = ({ furthestStep, recoveredForm }) => (
  <>
    {steps.slice(0, furthestStep).map((ActualStep, index: number) => {
      return <ActualStep key={index} {...recoveredForm} />;
    })}
  </>
);

const styles = {
  first: {
    row: {
      marginRight: "auto",
      marginLeft: "1.5rem",
      whiteSpace: "nowrap"
    }
  },
  second: {
    container: {
      marginTop: 28
    },
    checked: {
      marginRight: "10px"
    },
    unchecked: {
      marginLeft: "3px",
      marginRight: "12px"
    }
  },
  third: {
    container: {
      marginTop: 28,
      paddingRight: "8rem"
    },
    reputationDistribution: {
      width: "17.5em"
    },
    lineGraphic: {
      padding: "unset"
    },
    hasTokens: {
      paddingTop: "20px",
      width: "17.5em"
    }
  }
};
