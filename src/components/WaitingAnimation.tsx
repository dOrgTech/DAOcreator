import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import {
  CircularProgress,
  DialogContent,
  withStyles,
  Theme,
  Dialog,
  DialogTitle,
  WithStyles,
  createStyles,
} from "@material-ui/core"
import { AppState } from "../AppState"

interface Props extends WithStyles<typeof styles> {
  message: string
  type?: "transaction"
  open: boolean
}

const WaitingAnmination: React.SFC<Props> = ({ message, open, classes }) => (
  <Dialog aria-labelledby="simple-dialog-title" open={open}>
    <DialogTitle id="simple-dialog-title">{message}</DialogTitle>
    <DialogContent className={classes.dialogContent}>
      <CircularProgress size={200} />
    </DialogContent>
  </Dialog>
)

// STYLE
const styles = ({ palette }: Theme) =>
  createStyles({ dialogContent: { textAlign: "center" } })

const componentWithStyles = withStyles(styles)(WaitingAnmination)

// STATE
const mapStateToProps = (state: AppState, { match }: any) => {
  return {
    message: state.waitingAnimation.message,
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
