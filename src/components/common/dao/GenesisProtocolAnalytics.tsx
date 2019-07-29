import * as React from "react";
import {
  WithStyles,
  Theme,
  createStyles,
  withStyles,
  Typography,
  LinearProgress
} from "@material-ui/core";
import { GenesisProtocol } from "../../../lib/state";

const BorderLinearProgress = withStyles({
  root: {
    height: 10,
    backgroundColor: "#94d8ff"
  },
  bar: {
    borderRadius: 20,
    backgroundColor: "#00a2ff"
  }
})(LinearProgress);

interface Props extends WithStyles<typeof styles> {
  data: GenesisProtocol;
}

class GenesisProtocolAnalytics extends React.Component<Props> {
  render() {
    const { data } = this.props;

    // Sliders?
    // Fast proposal speec
    // Dificulty to boost
    // Reputation loss (voter penalty)
    console.log(data.config.queuedVotePeriodLimit.toNumber());
    console.log(data.config.queuedVotePeriodLimit.toNumber() / 5184000);

    return (
      <>
        <Typography>Proposal Speed</Typography>
        <BorderLinearProgress
          variant="determinate"
          color="secondary"
          value={(data.config.queuedVotePeriodLimit.toNumber() / 5184000) * 100}
        />
        <Typography>Boost Difficulty</Typography>
        <BorderLinearProgress
          variant="determinate"
          color="secondary"
          value={50}
        />
        <Typography>Voter Misalignment Penalty</Typography>
        <BorderLinearProgress
          variant="determinate"
          color="secondary"
          value={50}
        />
        <Typography>Proposer Alignment Incentive</Typography>
        <BorderLinearProgress
          variant="determinate"
          color="secondary"
          value={50}
        />
      </>
    );
  }
}

const styles = (theme: Theme) => createStyles({});

export default withStyles(styles)(GenesisProtocolAnalytics);
