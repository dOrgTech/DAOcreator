// TODO: options:
//       - export button (popover w/ download button + youtube video for how to use the file)
//       - multi-step process for deployment
import * as React from "react";
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";
import { DAOcreatorState } from "../../../lib/state";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  state: DAOcreatorState;
}

const DeployStep: React.SFC<Props> = ({}) => <></>;

// STYLE
const styles = (theme: Theme) => createStyles({});

export default withStyles(styles)(DeployStep);
