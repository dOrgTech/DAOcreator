import * as React from "react";
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles,
  IconButton
} from "@material-ui/core";
import SupportIcon from "@material-ui/icons/ContactSupport";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {}

const Support: React.SFC<Props> = ({ classes }) => (
  <IconButton
    onClick={() => window.open("https://dorgtech.typeform.com/to/IaeXKv")}
    className={classes.supportButton}
  >
    <SupportIcon className={classes.supportIcon} />
  </IconButton>
);

const styles = (theme: Theme) =>
  createStyles({
    supportButton: {
      position: "fixed",
      right: "5px",
      bottom: "5px",
      color: "#4bd2c6",
      backgroundColor: "rgba(2, 46, 46, 0.5)",
      "&:hover": {
        backgroundColor: "black"
      }
    },
    supportIcon: {
      color: "#4bd2c6"
    }
  });

export default withStyles(styles)(Support);
