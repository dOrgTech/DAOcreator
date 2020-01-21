export const simpleOptionsSwitcher = (
  schemes: any | undefined | Array<any>,
  advanceMode?: boolean,
  setRewardSuccess: any = (setter: any) => setter,
  setRewardAndPenVoters: any = (setter: any) => setter,
  setAutobet: any = (setter: any) => setter
) => {
  // TODO: Need to pass logic here now.
  const simpleOptions: any = [];
  const simpleOptionsSwitcherToggle = (scheme: any) => {
    let simpleOption = {};
    const { votingMachine } = scheme.values;
    // if (advanceMode) {
    const {
      proposingRepReward,
      votersReputationLossRatio,
      minimumDaoBounty
    } = votingMachine.$;
    if (Number(proposingRepReward.value) > 0) {
      simpleOption = {
        text: "Reward successful proposer",
        checked: true
      };
      simpleOptions.push(simpleOption);
      // setRewardSuccess(true);
    } else {
      // setRewardSuccess(false);
      simpleOption = {
        text: "Reward successful proposer",
        checked: false
      };
      simpleOptions.push(simpleOption);
    }
    if (Number(votersReputationLossRatio.value) > 0) {
      // setRewardAndPenVoters(true);
      simpleOption = {
        text: "Reward correct voters and penalize incorrect voters",
        checked: true
      };
      simpleOptions.push(simpleOption);
    } else {
      // setRewardAndPenVoters(false);
      simpleOption = {
        text: "Reward correct voters and penalize incorrect voters",
        checked: false
      };
      simpleOptions.push(simpleOption);
    }
    if (Number(minimumDaoBounty.value > 0)) {
      // setAutobet(true);
      simpleOption = {
        text: "Auto-bet against every proposal to incentive curation",
        checked: true
      };
      simpleOptions.push(simpleOption);
    } else {
      // setAutobet(false);
      simpleOption = {
        text: "Auto-bet against every proposal to incentive curation",
        checked: false
      };
      simpleOptions.push(simpleOption);
    }
  };

  schemes.$.map(simpleOptionsSwitcherToggle);
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
