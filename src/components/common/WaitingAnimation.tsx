import {
  CircularProgress,
  createStyles,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RootState } from "../../lib/state";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  message: string;
  details: string;
  type?: "transaction";
  open: boolean;
}

const WaitingAnmination: React.SFC<Props> = ({
  message,
  details,
  open,
  classes
}) => (
  <Dialog aria-labelledby="simple-dialog-title" open={open}>
    <DialogTitle id="simple-dialog-title">{message}</DialogTitle>
    <DialogContent className={classes.dialogContent}>
      <DialogContentText>{details}</DialogContentText>
      <CircularProgress size={40} className={classes.circularProgress} />
    </DialogContent>
  </Dialog>
);

// STYLE
const styles = ({ palette }: Theme) =>
  createStyles({
    dialogContent: { textAlign: "center" },
    circularProgress: { marginTop: 15 }
  });

const componentWithStyles = withStyles(styles)(WaitingAnmination);

// STATE
const mapStateToProps = (state: RootState, { match }: any) => {
  const details = state.waitingAnimation.details;
  return {
    message: state.waitingAnimation.message,
    details: details ? details : "",
    type: state.waitingAnimation.type,
    open: state.waitingAnimation.open
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles);
