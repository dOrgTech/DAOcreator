import * as React from "react";
import {
  withStyles,
  Snackbar,
  SnackbarContent,
  Theme,
  WithStyles,
  createStyles,
} from "@material-ui/core";

interface Props extends WithStyles<typeof styles> {
  message: string
  type: string
  open: boolean
  close: () => void
};

const Notifications: React.SFC<Props> = ({
  message,
  type,
  open,
  close,
  classes,
}) => (
  <Snackbar
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    open={open}
    autoHideDuration={10000}
    onClose={close}
    ContentProps={{
      "aria-describedby": "message-id",
    }}
  >
    <SnackbarContent
      className={classes[type]}
      message={<span id="message-id">{message}</span>}
    />
  </Snackbar>
);

const styles = ({ palette }: Theme) =>
  createStyles({
    error: {
      backgroundColor: palette.error.dark,
    },
    info: {
      backgroundColor: palette.primary.dark,
    },
  });

export default withStyles(styles)(Notifications);
