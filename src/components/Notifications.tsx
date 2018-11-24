import * as React from "react"
import { connect } from "react-redux"
import {
  withStyles,
  Snackbar,
  SnackbarContent,
  Theme,
  WithStyles,
  createStyles,
} from "@material-ui/core"
import { closeNotification } from "../state/actions/notifications"

interface Props extends WithStyles<typeof styles> {
  message: string
  type: string
  open: boolean
  close: () => void
}

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
)

// STYLE
const styles = ({ palette }: Theme) =>
  createStyles({
    error: {
      backgroundColor: palette.error.dark,
    },
    info: {
      backgroundColor: palette.primary.dark,
    },
  })

const componentWithStyles = withStyles(styles)(Notifications)

// STATE
const mapStateToProps = (state: any, { match }: any) => {
  return {
    message: state.notification.message,
    type: state.notification.type,
    open: state.notification.open,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    close: () => dispatch(closeNotification()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
