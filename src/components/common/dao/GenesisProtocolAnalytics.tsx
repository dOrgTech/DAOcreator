import * as React from "react";
import { observer } from "mobx-react";
import {
  WithStyles,
  Theme,
  createStyles,
  withStyles,
  Typography,
  LinearProgress
} from "@material-ui/core";
import { GenesisProtocolForm, StringField } from "../../../lib/forms";

interface Props extends WithStyles<typeof styles> {
  form: GenesisProtocolForm;
}

@observer
class GenesisProtocolAnalytics extends React.Component<Props> {
  render() {
    const { form } = this.props;

    const proposalSpeedAnalytics = CombineResults(
      AnalyzeField(form.$.boostedVotePeriodLimit, {
        min: 129600,
        max: 691200,
        toString: secondsToDays
      })
    );

    // TODO: other fields + message + warning

    return (
      <>
        <Typography>Proposal Speed</Typography>
        <Slider value={proposalSpeedAnalytics.t * 100} />
        <Typography>Boost Difficulty</Typography>
        <Slider value={50} />
        <Typography>Voter Misalignment Penalty</Typography>
        <Slider value={50} />
        <Typography>Proposer Alignment Incentive</Typography>
        <Slider value={50} />
      </>
    );
  }
}

const secondsToDays = (seconds: number): string => {
  return `${seconds / 86400} Days`;
};

interface AnalyzeResult {
  t: number;
  message: string;
  warning: boolean;
}

interface AnalyzeOpts {
  min: number;
  max: number;
  toString?: (value: number) => string;
}

const AnalyzeField = (field: StringField, opts: AnalyzeOpts): AnalyzeResult => {
  const value = Number(field.value);
  const { min, max } = opts;
  let toString = opts.toString;

  // Lerp between min and max based on
  let t = (value - min) / (max - min);

  const warning: boolean = t < 0 || t > 1;
  let message: string = `${field.displayName}: `;

  if (!toString) {
    toString = (value: number) => value.toString();
  }

  if (t < 0) {
    message = `Lower than the recommended minimum of ${toString(min)}`;
    t = 0;
  } else if (t > 1) {
    message = `Higher than the recommended maximum of ${toString(max)}`;
    t = 1;
  } else {
    message = toString(value);
  }

  return {
    t,
    message,
    warning
  };
};

const CombineResults = (...results: AnalyzeResult[]): AnalyzeResult => {
  // Aggregate results into a single result struct
  let result: AnalyzeResult = {
    t: 0,
    warning: false,
    message: ""
  };

  results.forEach((value, index) => {
    result.t += value.t;
    result.warning = result.warning || value.warning;
    result.message += value.message;
    if (index !== results.length - 1) {
      result.message += "\n";
    }
  });

  // Average the t values
  result.t /= results.length;

  return result;
};

const Slider = (props: { value: number }) => {
  const Styled = withStyles({
    root: {
      height: 10,
      backgroundColor: "#94d8ff"
    },
    bar: {
      borderRadius: 20,
      backgroundColor: "#00a2ff"
    }
  })(LinearProgress);

  return <Styled variant="determinate" color="secondary" value={props.value} />;
};

const styles = (theme: Theme) => createStyles({});

export default withStyles(styles)(GenesisProtocolAnalytics);

// Proposal Speed
// [     |          ]
// on hover:
// boostedVotePeriodLimit: 1.5 days (min 1.5, max)
// Bar: 2342 (min, max)
// Baz: 23422 (min, max)
// average all values

// If value is below 0, give warning + set it to zero
// Warning: `boostedVotePeriodLimit` is below the recommended minimum of 1.5 days.
