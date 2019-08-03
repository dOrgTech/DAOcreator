import * as React from "react";
import { observer } from "mobx-react";
import {
  WithStyles,
  Theme,
  createStyles,
  withStyles,
  Typography,
  Divider
} from "@material-ui/core";
import AnalysisResultView from "./AnalysisResultView";
import { analyzeField, AnalysisResult } from "./utils";
import { GenesisProtocolForm } from "../../../../lib/forms";
import { GenesisProtocol as GP } from "../../../../lib/dependency/arc";
import { TypeConversion } from "../../../../lib/dependency/web3";
const fromWei = TypeConversion.fromWei;

interface Props extends WithStyles<typeof styles> {
  form: GenesisProtocolForm;
}

@observer
class GenesisProtocolAnalytics extends React.Component<Props> {
  render() {
    const { classes, form } = this.props;

    const secondsToString = (seconds: number) =>
      formatDays(secondsToDays(seconds));

    const proposalSpeedAnalytics = combineResults(
      analyzeField(form.$.boostedVotePeriodLimit, {
        min: GP.EasyConfig.boostedVotePeriodLimit.toNumber(),
        max: GP.CriticalConfig.boostedVotePeriodLimit.toNumber(),
        toString: secondsToString
      }),
      analyzeField(form.$.queuedVotePeriodLimit, {
        min: GP.EasyConfig.queuedVotePeriodLimit.toNumber(),
        max: GP.CriticalConfig.queuedVotePeriodLimit.toNumber(),
        toString: secondsToString
      }),
      analyzeField(form.$.preBoostedVotePeriodLimit, {
        min: GP.EasyConfig.preBoostedVotePeriodLimit.toNumber(),
        max: GP.CriticalConfig.preBoostedVotePeriodLimit.toNumber(),
        toString: secondsToString
      })
    );

    const boostDifficultyAnalytics = combineResults(
      analyzeField(form.$.minimumDaoBounty, {
        min: Number(fromWei(GP.EasyConfig.minimumDaoBounty)),
        max: Number(fromWei(GP.CriticalConfig.minimumDaoBounty)),
        toString: formatGEN
      }),
      analyzeField(form.$.thresholdConst, {
        min: GP.EasyConfig.thresholdConst.toNumber(),
        max: GP.CriticalConfig.thresholdConst.toNumber(),
        toString: (value: number) => value.toString()
      })
    );

    const voterAlignmentAssuranceAnalytics = combineResults(
      analyzeField(form.$.queuedVoteRequiredPercentage, {
        min: GP.EasyConfig.queuedVoteRequiredPercentage.toNumber(),
        max: GP.CriticalConfig.queuedVoteRequiredPercentage.toNumber(),
        toString: formatPercentage
      }),
      analyzeField(form.$.quietEndingPeriod, {
        min: GP.EasyConfig.quietEndingPeriod.toNumber(),
        max: GP.CriticalConfig.quietEndingPeriod.toNumber(),
        toString: secondsToString
      })
    );

    const alignmentIncentiveAnalytics = combineResults(
      analyzeField(form.$.proposingRepReward, {
        min: Number(fromWei(GP.EasyConfig.proposingRepReward)),
        max: Number(fromWei(GP.CriticalConfig.proposingRepReward)),
        toString: formatREP
      }),
      analyzeField(form.$.daoBountyConst, {
        min: GP.EasyConfig.daoBountyConst.toNumber(),
        max: GP.CriticalConfig.daoBountyConst.toNumber(),
        toString: (value: number) => value.toString()
      })
    );

    const voterMisalignmentPenaltyAnalytics = combineResults(
      analyzeField(form.$.votersReputationLossRatio, {
        min: GP.EasyConfig.votersReputationLossRatio.toNumber(),
        max: GP.CriticalConfig.votersReputationLossRatio.toNumber(),
        toString: formatPercentage
      })
    );

    // TODO: voteOnBehalf (etherscan link), activationTime (timer letting them know how long it'll be deactive for)
    return (
      <>
        <Divider className={classes.divider} />
        <AnalysisResultView
          title="Proposal Duration"
          result={proposalSpeedAnalytics}
        />
        <Divider className={classes.divider} />
        <AnalysisResultView
          title="Boost Difficulty"
          result={boostDifficultyAnalytics}
        />
        <Divider className={classes.divider} />
        <AnalysisResultView
          title="Voter Alignment Assurance"
          result={voterAlignmentAssuranceAnalytics}
        />
        <Divider className={classes.divider} />
        <AnalysisResultView
          title="Alignment Incentive"
          result={alignmentIncentiveAnalytics}
        />
        <Divider className={classes.divider} />
        <AnalysisResultView
          title="Voter Misalignment Penalty"
          result={voterMisalignmentPenaltyAnalytics}
        />
      </>
    );
  }
}

// TODO: make this into a "DateTime" dependency in the lib when
// that field view is made
const secondsToDays = (seconds: number): number => {
  return seconds / 86400;
};

const formatDays = (days: number): string => {
  return `${Math.fround(days)} Days`;
};

const formatPercentage = (percentage: number): string => {
  return `${Math.fround(percentage)}%`;
};

const formatGEN = (gen: number): string => {
  return `${Math.fround(gen)} GEN`;
};

const formatREP = (rep: number): string => {
  return `${Math.fround(rep)} REP`;
};

export const combineResults = (
  ...results: AnalysisResult[]
): AnalysisResult => {
  // Aggregate results into a single result struct
  let result: AnalysisResult = {
    t: 0,
    warning: false,
    message: ""
  };

  results.forEach(value => {
    result.t += value.t;
    result.warning = result.warning || value.warning;
  });

  result.message = (
    <>
      <ul>
        {results.map(result => (
          <li>
            <Typography color={result.warning ? "secondary" : "primary"}>
              {result.message}
            </Typography>
          </li>
        ))}
      </ul>
    </>
  );

  // Average the t values
  result.t /= results.length;

  return result;
};

const styles = (theme: Theme) =>
  createStyles({
    divider: {
      marginTop: 10,
      marginBottom: 5
    }
  });

export default withStyles(styles)(GenesisProtocolAnalytics);
