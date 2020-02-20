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
