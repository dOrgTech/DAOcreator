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
  Grid
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
    const { form } = this.props;

    const secondsToString = (seconds: BN) => formatDays(secondsToDays(seconds));

    const proposalSpeedAnalytics = combineResults(
      analyzeField(form.$.boostedVotePeriodLimit, {
        min: GP.EasyConfig.boostedVotePeriodLimit,
        max: GP.CriticalConfig.boostedVotePeriodLimit,
        toString: secondsToString
      }),
      analyzeField(form.$.queuedVotePeriodLimit, {
        min: GP.EasyConfig.queuedVotePeriodLimit,
        max: GP.CriticalConfig.queuedVotePeriodLimit,
        toString: secondsToString
      }),
      analyzeField(form.$.preBoostedVotePeriodLimit, {
        min: GP.EasyConfig.preBoostedVotePeriodLimit,
        max: GP.CriticalConfig.preBoostedVotePeriodLimit,
        toString: secondsToString
      })
    );

    const voterAlignmentAssuranceAnalytics = combineResults(
      analyzeField(form.$.queuedVoteRequiredPercentage, {
        min: GP.EasyConfig.queuedVoteRequiredPercentage,
        max: GP.CriticalConfig.queuedVoteRequiredPercentage,
        toString: formatPercentage
      }),
      analyzeField(form.$.quietEndingPeriod, {
        min: GP.EasyConfig.quietEndingPeriod,
        max: GP.CriticalConfig.quietEndingPeriod,
        toString: secondsToString
      })
    );

    const boostDifficultyAnalytics = combineResults(
      analyzeField(form.$.minimumDaoBounty, {
        min: toBN(fromWei(GP.EasyConfig.minimumDaoBounty)),
        max: toBN(fromWei(GP.CriticalConfig.minimumDaoBounty)),
        toString: formatGEN
      }),
      analyzeField(form.$.thresholdConst, {
        min: GP.EasyConfig.thresholdConst,
        max: GP.CriticalConfig.thresholdConst,
        toString: (value: BN) => value.toString()
      })
    );

    const alignmentIncentiveAnalytics = combineResults(
      analyzeField(form.$.proposingRepReward, {
        min: toBN(fromWei(GP.EasyConfig.proposingRepReward)),
        max: toBN(fromWei(GP.CriticalConfig.proposingRepReward)),
        toString: formatREP
      }),
      analyzeField(form.$.daoBountyConst, {
        min: GP.EasyConfig.daoBountyConst,
        max: GP.CriticalConfig.daoBountyConst,
        toString: (value: BN) => value.toString()
      })
    );

    const voterMisalignmentPenaltyAnalytics = combineResults(
      analyzeField(form.$.votersReputationLossRatio, {
        min: GP.EasyConfig.votersReputationLossRatio,
        max: GP.CriticalConfig.votersReputationLossRatio,
        toString: formatPercentage
      })
    );

    // TODO: voteOnBehalf (etherscan link), activationTime (timer letting them know how long it'll be deactive for)

    return (
      <>
        <Typography>Proposal Duration</Typography>
        <AnalysisResultView result={proposalSpeedAnalytics} />
        <Typography>Voter Alignment Assurance</Typography>
        <AnalysisResultView result={voterAlignmentAssuranceAnalytics} />
        <Typography>Boost Difficulty</Typography>
        <AnalysisResultView result={boostDifficultyAnalytics} />
        <Typography>Alignment Incentive</Typography>
        <AnalysisResultView result={alignmentIncentiveAnalytics} />
        <Typography>Voter Misalignment Penalty</Typography>
        <AnalysisResultView result={voterMisalignmentPenaltyAnalytics} />
      </>
    );
  }
}

// TODO use BN instead of number everywhere
const secondsToDays = (seconds: BN): BN => {
  return seconds.div(toBN(86400));
};

const formatDays = (days: BN): string => {
  return `${Math.fround(days.toNumber())} Days`;
};

const formatPercentage = (percentage: BN): string => {
  return `${Math.fround(percentage.toNumber())}%`;
};

const formatGEN = (gen: BN): string => {
  return `${Math.fround(gen.toNumber())} GEN`;
};

const formatREP = (rep: BN): string => {
  return `${Math.fround(rep.toNumber())} REP`;
};

interface AnalysisResult {
  t: BN;
  message: string | React.ReactFragment;
  warning: boolean;
}

interface AnalysisOpts {
  min: BN;
  max: BN;
  toString: (value: BN) => string;
}

const analyzeField = (
  field: StringField,
  opts: AnalysisOpts
): AnalysisResult => {
  const value = toBN(field.value);
  const { min, max } = opts;
  let toString = opts.toString;

  // Lerp between min and max based on
  let t: number;

  if (
    Math.round(min.toNumber() * 10000) === Math.round(max.toNumber() * 10000)
  ) {
    if (value > max) {
      t = 1.1;
    } else if (value < min) {
      t = -0.1;
    } else {
      t = 1;
    }
  } else {
    t = value
      .sub(min)
      .div(max.sub(min))
      .toNumber();
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
    t: toBN(t),
    message,
    warning
  };
};

const combineResults = (...results: AnalysisResult[]): AnalysisResult => {
  // Aggregate results into a single result struct
  let result: AnalysisResult = {
    t: toBN(0),
    warning: false,
    message: ""
  };

  results.forEach((value, index) => {
    result.t = result.t.add(value.t);
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
  result.t.div(toBN(results.length));

  return result;
};

const AnalysisResultView = (props: { result: AnalysisResult }) => {
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

  const { result } = props;
  let value = result.t.toNumber();

  // keep a little showing if there is no bar
  if (result.t.isZero() && !result.warning) {
    value = 0.05;
  }

  value *= 100;

  return (
    <Info title={result.message} placement={"top"}>
      <Grid>
        {result.warning ? (
          <Warning variant="determinate" color="secondary" value={value} />
        ) : (
          <Normal variant="determinate" color="secondary" value={value} />
        )}
      </Grid>
    </Info>
  );
};

const styles = (theme: Theme) => createStyles({});

export default withStyles(styles)(GenesisProtocolAnalytics);
