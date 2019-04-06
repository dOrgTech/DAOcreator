import * as React from "react"
import * as R from "ramda"
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
import { RootState } from "../../state"
import NotificationActions, * as notificationActions from "../../redux/actions/notifications"
import { Notification as NotificationType } from "../../redux/reducers/notifications"

interface Props extends WithStyles<typeof styles> {
  notifications: NotificationType[]
  actions: NotificationActions
}

const Notifications: React.SFC<Props> = ({
  notifications,
  actions,
  classes,
}) => {
  return (
    <>
      {R.map(
        ({ id, message, type, duration, persist }) => (
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={true}
            autoHideDuration={persist ? undefined : duration}
            onClose={async () => await actions.removeNotification(id as string)}
            ContentProps={{
              "aria-describedby": "message-id",
            }}
            key={id}
          >
            <SnackbarContent
              className={classes[type]}
              message={<span id="message-id">{message}</span>}
            />
          </Snackbar>
        ),
        notifications
      )}
    </>
  )
}

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
const mapStateToProps = (state: RootState, { match }: any) => {
  return {
    notifications: R.values(state.notification.notifications),
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
