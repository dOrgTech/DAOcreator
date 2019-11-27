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
import { GenesisProtocolForm } from "@dorgtech/daocreatorlib";
import { GenesisProtocol as GP } from "@dorgtech/daocreatorlib";

// eslint-disable-next-line
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
      analyzeField(
        form.$.boostedVotePeriodLimit.toSeconds(),
        form.$.boostedVotePeriodLimit.displayName,
        {
          min: GP.EasyConfig.boostedVotePeriodLimit,
          max: GP.CriticalConfig.boostedVotePeriodLimit,
          toString: secondsToString
        }
      ),
      analyzeField(
        form.$.queuedVotePeriodLimit.toSeconds(),
        form.$.queuedVotePeriodLimit.displayName,
        {
          min: GP.EasyConfig.queuedVotePeriodLimit,
          max: GP.CriticalConfig.queuedVotePeriodLimit,
          toString: secondsToString
        }
      ),
      analyzeField(
        form.$.preBoostedVotePeriodLimit.toSeconds(),
        form.$.preBoostedVotePeriodLimit.displayName,
        {
          min: GP.EasyConfig.preBoostedVotePeriodLimit,
          max: GP.CriticalConfig.preBoostedVotePeriodLimit,
          toString: secondsToString
        }
      )
    );

    const boostDifficultyAnalytics = combineResults(
      analyzeField(
        Number(form.$.minimumDaoBounty.value),
        form.$.minimumDaoBounty.displayName,
        {
          min: GP.EasyConfig.minimumDaoBounty,
          max: GP.CriticalConfig.minimumDaoBounty,
          toString: formatGEN
        }
      ),
      analyzeField(
        Number(form.$.thresholdConst.value),
        form.$.thresholdConst.displayName,
        {
          min: GP.EasyConfig.thresholdConst,
          max: GP.CriticalConfig.thresholdConst,
          toString: (value: number) => value.toString()
        }
      )
    );

    const voterAlignmentAssuranceAnalytics = combineResults(
      analyzeField(
        Number(form.$.queuedVoteRequiredPercentage.value),
        form.$.queuedVoteRequiredPercentage.displayName,
        {
          min: GP.EasyConfig.queuedVoteRequiredPercentage,
          max: GP.CriticalConfig.queuedVoteRequiredPercentage,
          toString: formatPercentage
        }
      ),
      analyzeField(
        form.$.quietEndingPeriod.toSeconds(),
        form.$.quietEndingPeriod.displayName,
        {
          min: GP.EasyConfig.quietEndingPeriod,
          max: GP.CriticalConfig.quietEndingPeriod,
          toString: secondsToString
        }
      )
    );

    const alignmentIncentiveAnalytics = combineResults(
      analyzeField(
        Number(form.$.proposingRepReward.value),
        form.$.proposingRepReward.displayName,
        {
          min: GP.EasyConfig.proposingRepReward,
          max: GP.CriticalConfig.proposingRepReward,
          toString: formatREP
        }
      ),
      analyzeField(
        Number(form.$.daoBountyConst.value),
        form.$.daoBountyConst.displayName,
        {
          min: GP.EasyConfig.daoBountyConst,
          max: GP.CriticalConfig.daoBountyConst,
          toString: (value: number) => value.toString()
        }
      )
    );

    const voterMisalignmentPenaltyAnalytics = combineResults(
      analyzeField(
        Number(form.$.votersReputationLossRatio.value),
        form.$.votersReputationLossRatio.displayName,
        {
          min: GP.EasyConfig.votersReputationLossRatio,
          max: GP.CriticalConfig.votersReputationLossRatio,
          toString: formatPercentage
        }
      )
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

// TODO: make this into a "DateTime" dependency in the @dorgtech/daocreatorlib when
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
    <div style={{ margin: "10px" }}>
      {results.map((result, index) => {
        const msg = result.message as string;

        if (msg === undefined) {
          throw Error("This should never happen");
        }

        const parts = msg.split(":");

        if (parts.length !== 2) {
          throw Error("Message is malformed");
        }

        return (
          <Typography
            color={result.warning ? "error" : "textPrimary"}
            key={`msg-${index}`}
          >
            <b>{parts[0]}:</b> {parts[1]}
          </Typography>
        );
      })}
    </div>
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
