import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import {
  withStyles,
  Snackbar,
  SnackbarContent,
  Theme,
  WithStyles,
  createStyles,
} from "@material-ui/core"
import NotificationActions, * as notificationActions from "src/redux/actions/notifications"
import { AppState } from "src/AppState"

interface Props extends WithStyles<typeof styles> {
  message: string
  type: string
  open: boolean
  actions: NotificationActions
}

const Notifications: React.SFC<Props> = ({
  message,
  type,
  open,
  actions,
  classes,
}) => (
  <Snackbar
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    open={open}
    autoHideDuration={10000}
    onClose={async () => await actions.closeNotification()}
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
const mapStateToProps = (state: AppState, { match }: any) => {
  return {
    message: state.notification.message,
    type: state.notification.type,
    open: state.notification.open,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    actions: bindActionCreators(notificationActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
