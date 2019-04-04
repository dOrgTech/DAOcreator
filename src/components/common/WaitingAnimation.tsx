import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import {
  CircularProgress,
  DialogContent,
  DialogContentText,
  withStyles,
  Theme,
  Dialog,
  DialogTitle,
  WithStyles,
  createStyles,
} from "@material-ui/core"
import { RootState } from "../../state"

interface Props extends WithStyles<typeof styles> {
  message: string
  details: string
  type?: "transaction"
  open: boolean
}

const WaitingAnmination: React.SFC<Props> = ({
  message,
  details,
  open,
  classes,
}) => (
  <Dialog aria-labelledby="simple-dialog-title" open={open}>
    <DialogTitle id="simple-dialog-title">{message}</DialogTitle>
    <DialogContent className={classes.dialogContent}>
      <DialogContentText>{details}</DialogContentText>
      <CircularProgress size={200} />
    </DialogContent>
  </Dialog>
)

// STYLE
const styles = ({ palette }: Theme) =>
  createStyles({ dialogContent: { textAlign: "center" } })

const componentWithStyles = withStyles(styles)(WaitingAnmination)

// STATE
const mapStateToProps = (state: RootState, { match }: any) => {
  const details = state.waitingAnimation.details
  return {
    message: state.waitingAnimation.message,
    details: details ? details : "",
    type: state.waitingAnimation.type,
    open: state.waitingAnimation.open,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
