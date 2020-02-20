import React, { FC } from "react";

import { MembersForm, SchemesForm } from "@dorgtech/daocreator-lib";

import LineGraphic from "../LineGraphic";
import { MDBIcon, MDBRow, MDBCol } from "mdbreact";

export const ConfigPreview: FC<{ daoName: string; daoSymbol: string }> = ({
  daoName,
  daoSymbol
}) => (
  <MDBRow style={styles.configPreview}>
    <MDBCol>
      <span>
        Name: <strong>{daoName}</strong>
      </span>
    </MDBCol>
    <MDBCol>
      <span>
        Symbol: <strong>{daoSymbol}</strong>
      </span>
    </MDBCol>
  </MDBRow>
);

interface SimpleOption {
  text: string;
  checked: boolean;
}

export const SchemesPreview: FC<{ form: SchemesForm }> = ({ form }) => {
  if (form.$.length === 0) return null;

  const {
    proposingRepReward,
    votersReputationLossRatio,
    minimumDaoBounty
  } = form.$[0].$.votingMachine.values;

  const simpleOptions: [SimpleOption, SimpleOption, SimpleOption] = [
    { text: "Reward successful proposer", checked: +proposingRepReward > 0 },
    {
      text: "Reward correct voters and penalize incorrect voters",
      checked: +votersReputationLossRatio > 0
    },
    {
      text: "Auto-bet against every proposal to incentive curation",
      checked: +minimumDaoBounty > 0
    }
  ];

  return (
    <div style={styles.schemePreview}>
      <p>
        <strong>Recommended</strong>
      </p>
      {simpleOptions.map(({ text, checked }: SimpleOption, index: number) => (
        <div key={index}>
          <p>
            <MDBIcon
              icon={checked ? "check" : "times"}
              className={checked ? "blue-text" : "red-text"}
              style={
                checked
                  ? { marginRight: "10px" }
                  : { marginLeft: "3px", marginRight: "12px" } // x icon is smaller
              }
            />
            {text}
          </p>
        </div>
      ))}
    </div>
  );
};

export const MembersPreview: FC<{
  form: MembersForm;
  tokenSymbol: string;
}> = ({ form, tokenSymbol }) => {
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
    symbol: tokenSymbol,
    dataKey: "tokens",
    nameKey: "address"
  };
  let totalReputationAmount = 0;
  let totalTokenAmount = 0;
  form.toState().map(({ reputation, tokens }: any) => {
    totalReputationAmount += reputation;
    totalTokenAmount += tokens;
    return null;
  });
  const numberOfMembers = form.$.length;
  return (
    <div style={styles.membersPreview}>
      <p>
        {numberOfMembers} Member{numberOfMembers > 1 && "s"}
      </p>
      <div style={{ width: "17.5em" }}>
        <p>Reputation Distribution</p>
        <LineGraphic
          data={form.toState() as any} // Working with this type is weird
          total={totalReputationAmount}
          config={reputationConfig}
          style={styles.lineGraphic}
        />
      </div>
      {totalTokenAmount > 0 && (
        <div style={{ paddingTop: "20px", width: "17.5em" }}>
          <p>{tokenSymbol} Token Distribution</p>
          <LineGraphic
            data={form.toState() as any} // Working with this type is weird
            total={totalTokenAmount}
            config={tokenConfig}
            style={styles.lineGraphic}
          />
        </div>
      )}
    </div>
  );
};

const styles = {
  configPreview: {
    marginTop: "26px",
    marginRight: "auto",
    marginLeft: "1.5rem",
    whiteSpace: "nowrap"
  },
  schemePreview: {
    marginTop: 28
  },
  membersPreview: {
    marginTop: 28,
    paddingRight: "8rem"
  },
  lineGraphic: {
    padding: "unset"
  }
};
