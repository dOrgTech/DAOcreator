import { SchemesForm } from "@dorgtech/daocreator-lib";

export interface SimpleOption {
  text: string;
  checked: boolean;
}

export const getSimpleOptions = (form: SchemesForm) => {
  if (form.$.length === 0) return [];

  const {
    proposingRepReward,
    votersReputationLossRatio,
    minimumDaoBounty
  } = form.$[0].$.votingMachine.values;

  const simpleOptions: SimpleOption[] = [
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

  return simpleOptions;
};

// WIP decisionSpeedSwitcher
// This is one example of a condition to disable speeds
const schemePeriodLimits = {
  queuedVotePeriodLimit: "30:0:0:0",
  preBoostedVotePeriodLimit: "1:0:0:0",
  boostedVotePeriodLimit: "4:0:0:0"
};

const {
  queuedVotePeriodLimit,
  preBoostedVotePeriodLimit,
  boostedVotePeriodLimit
} = schemePeriodLimits;
export const decisionSpeedSwitcher = (form: any, decisionSpeed: number) => {
  const scheme = form;
  switch (decisionSpeed) {
    case 0:
      switch (scheme.displayName) {
        case "ContributionReward":
          if (
            queuedVotePeriodLimit !== "30:0:0:0" ||
            preBoostedVotePeriodLimit !== "1:0:0:0" ||
            boostedVotePeriodLimit !== "4:0:0:0"
          ) {
            // disable buttons
            // setToggleSpeed(false);
          }
          break;
        case "Scheme Registrar":
          if (
            queuedVotePeriodLimit !== "60:0:0:0" ||
            preBoostedVotePeriodLimit !== "2:0:0:0" ||
            boostedVotePeriodLimit !== "8:0:0:0"
          ) {
            // disable buttons
            // setToggleSpeed(false);
          }
          break;
      }
      break;
    case 1:
      switch (scheme.displayName) {
        case "ContributionReward":
          if (
            queuedVotePeriodLimit !== "60:0:0:0" ||
            preBoostedVotePeriodLimit !== "2:0:0:0" ||
            boostedVotePeriodLimit !== "8:0:0:0"
          ) {
            // disable buttons
            // setToggleSpeed(false);
          }
          break;
        case "Scheme Registrar":
          if (
            queuedVotePeriodLimit !== "60:0:0:0" ||
            preBoostedVotePeriodLimit !== "2:0:0:0" ||
            boostedVotePeriodLimit !== "8:0:0:0"
          ) {
            // disable buttons
            // setToggleSpeed(false);
          }
          break;
      }
      break;
    case 2:
      switch (scheme.displayName) {
        case "ContributionReward":
          if (
            queuedVotePeriodLimit !== "30:0:0:0" ||
            preBoostedVotePeriodLimit !== "1:0:0:0" ||
            boostedVotePeriodLimit !== "4:0:0:0"
          ) {
            // disable buttons
            // setToggleSpeed(false);
          }
          break;
        case "Scheme Registrar":
          if (
            queuedVotePeriodLimit !== "60:0:0:0" ||
            preBoostedVotePeriodLimit !== "2:0:0:0" ||
            boostedVotePeriodLimit !== "8:0:0:0"
          ) {
            // disable buttons
            // // setToggleSpeed(false);
          }
          break;
      }
      break;
  }
};
