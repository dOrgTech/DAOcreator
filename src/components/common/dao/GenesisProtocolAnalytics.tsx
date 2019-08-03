import * as React from "react";
import { observer } from "mobx-react";
import {
  WithStyles,
  Theme,
  createStyles,
  withStyles,
  Typography,
  LinearProgress,
  Tooltip,
  Grid,
  Divider
} from "@material-ui/core";
import { GenesisProtocolForm, StringField } from "../../../lib/forms";
import { GenesisProtocol as GP } from "../../../lib/dependency/arc";
import { TypeConversion } from "../../../lib/dependency/web3";
import BN from "bn.js";
const toBN = TypeConversion.toBN;
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

// TODO use BN instead of number everywhere
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

interface AnalysisResult {
  t: number;
  message: string | React.ReactFragment;
  warning: boolean;
}

interface AnalysisOpts {
  min: number;
  max: number;
  toString: (value: number) => string;
}

const analyzeField = (
  field: StringField,
  opts: AnalysisOpts
): AnalysisResult => {
  const value = Number(field.value);
  const { min, max } = opts;
  let toString = opts.toString;

  // Lerp between min and max based on
  let t: number;

  if (Math.fround(min - max) === 0) {
    if (value > max) {
      t = 1.1;
    } else if (value < min) {
      t = -0.1;
    } else {
      t = 1;
    }
  } else {
    t = (value - min) / (max - min);
  }

  const warning: boolean = t < 0 || t > 1;
  let message: string = ``;

  if (t < 0) {
    message += `[${
      field.displayName
    }] is LOWER than recommended min of ${toString(min)}`;
    t = 0;
  } else if (t > 1) {
    message += `[${
      field.displayName
    }] is LARGER than recommended max of ${toString(max)}`;
    t = 1;
  } else {
    message += `${field.displayName}: ${toString(value)}`;
  }

  return {
    t,
    message,
    warning
  };
};

const combineResults = (...results: AnalysisResult[]): AnalysisResult => {
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

const AnalysisResultView = (props: {
  title: string;
  result: AnalysisResult;
}) => {
  const NormalStyle = {
    root: {
      height: 10,
      backgroundColor: "#94d8ff"
    },
    bar: {
      borderRadius: 20,
      backgroundColor: "#00a2ff"
    }
  };
  const WarningStyle = {
    root: {
      height: 10,
      backgroundColor: "#ffd178"
    },
    bar: {
      borderRadius: 20,
      backgroundColor: "#ffa800"
    }
  };
  const Normal = withStyles(NormalStyle)(LinearProgress);
  const Warning = withStyles(WarningStyle)(LinearProgress);

  const Info = withStyles((theme: Theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      maxWidth: 600,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
      paddingRight: 40
    }
  }))(Tooltip);

  const { title, result } = props;
  let value = result.t;

  // keep a little showing if there is no bar
  if (Math.fround(result.t) === 0 && !result.warning) {
    value = 0.05;
  }

  value *= 100;

  return (
    <Info title={result.message} placement={"top"}>
      <Grid>
        <Typography variant="subtitle2">{title}</Typography>
        {result.warning ? (
          <Warning variant="determinate" color="secondary" value={value} />
        ) : (
          <Normal variant="determinate" color="secondary" value={value} />
        )}
      </Grid>
    </Info>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    divider: {
      marginTop: 10,
      marginBottom: 5
    }
  });

export default withStyles(styles)(GenesisProtocolAnalytics);
