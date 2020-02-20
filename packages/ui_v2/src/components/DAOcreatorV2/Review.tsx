import React from "react";
import { MDBRow, MDBCol, MDBIcon } from "mdbreact";
import LineGraphic from "../commonV2/LineGraphic";
import { SchemesPreview } from "../commonV2/Stepper/Preview";
import { getSimpleOptions } from "../utils";

const FirstStep = (form: any) => {
  return (
    <div>
      <h3>Config</h3>
      <MDBRow
        style={{
          marginRight: "auto",
          marginLeft: "1.5rem",
          whiteSpace: "nowrap"
        }}
      >
        <MDBCol>
          <span>
            Name: <strong>{form.$.config.$.daoName.value}</strong>
          </span>
        </MDBCol>
        <MDBCol>
          <span>
            Symbol: <strong>{form.$.config.$.tokenSymbol.value}</strong>
          </span>
        </MDBCol>
      </MDBRow>
    </div>
  );
};

const SecondStep = (form: any) => {
  if (form.$.schemes.length === 0) return null;

  return (
    <div style={{ marginTop: 28 }}>
      <h3>Schemes</h3>
      {getSimpleOptions(form.$.schemes).map((option: any, index: number) =>
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
  form.$.members.toState().map((member: any) => {
    totalReputationAmount += member.reputation;
    totalTokenAmount += member.tokens;
    return null;
  });
  const numberOfMembers = form.$.members.$.length;
  const hasTokens =
    form.$.members.$.reduce(
      (count: any, member: any) => +member.$.tokens.value + count,
      0
    ) > 0;
  return (
    <div
      style={{
        marginTop: 28,
        paddingRight: "8rem"
      }}
    >
      <h3>Members</h3>
      <p>
        {numberOfMembers} Member{numberOfMembers > 1 ? "s" : ""}
      </p>
      <div style={{ width: "17.5em" }}>
        <p>Reputation Distribution</p>
        <LineGraphic
          data={form.$.members.toState()}
          total={totalReputationAmount}
          config={reputationConfig}
          style={{ padding: "unset" }}
        />
      </div>
      {hasTokens ? (
        <>
          <div style={{ paddingTop: "20px", width: "17.5em" }}>
            <p>{form.$.config.$.daoName.value} Token Distribution</p>
            <LineGraphic
              data={form.$.members.toState()}
              total={totalTokenAmount}
              config={tokenConfig}
              style={{ padding: "unset" }}
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

export function Review(props: any) {
  const { recoveredForm, step } = props;
  return (
    <>
      {steps.slice(0, step).map(ActualStep => {
        return <ActualStep {...recoveredForm} />;
      })}
      {/* {steps.slice(0, step).map((ActualStep, index: number) => {
        return <ActualStep key={index} {...recoveredForm} />;
      })} */}
    </>
  );
}
