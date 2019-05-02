import { withSnackbar } from "notistack"
import * as R from "ramda"
import * as React from "react"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import NotificationActions, * as notificationActions from "../../redux/actions/notifications"
import { Notification as NotificationType } from "../../redux/reducers/notifications"
import { RootState } from "../../state"
import { Button } from "@material-ui/core"

interface Props {
  notifications: NotificationType[]
  enqueueSnackbar: any
  closeSnackbar: (key: string) => void
  actions: NotificationActions
}

interface State {
  activeIdToKey: { [id: string]: string }
}

class Notifications extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      activeIdToKey: {}, // holds the id (the notifications id) to key (notistack's internally used id - used for closing) mapping for displaying notifications
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {
      notifications,
      enqueueSnackbar,
      closeSnackbar,
      actions,
    } = this.props

    const { activeIdToKey } = this.state
    // finds the notifications that are added to the Redux store
    const notificationsToAdd = getNewNotifications(notifications, activeIdToKey)

    // finds the notifications that are removed from the Redux store
    const notificationKeysToRemove = getIdOfRemovedNotifications(
      notifications,
      activeIdToKey
    )

    // display the new notifications
    const newKeys = R.map(
      notification =>
        enqueueSnackbar(notification.message, {
          autoHideDuration: notification.persist
            ? undefined
            : notification.duration || 5000, // 5 seconds is the default duration (used if neither duration or persist)
          persist: notification.persist,
          variant: notification.type,
          onClose: () => actions.removeNotification(notification.id as string),
          action: (key: string) => (
            <Button size="small" onClick={() => this.props.closeSnackbar(key)}>
              Dismiss
            </Button>
          ),
        }),
      notificationsToAdd
    )

    // add new mappings to the activeIdToKey map
    if (newKeys.length != 0) {
      this.setState({
        activeIdToKey: {
          ...activeIdToKey,
          ...R.zipObj(R.map(n => n.id as string, notificationsToAdd), newKeys),
        },
      })
    }

    // hide/remove the notifications that was removed from the store
    R.forEach(
      notificationId => closeSnackbar(activeIdToKey[notificationId]),
      notificationKeysToRemove
    )

    // remove removed notifications from the activeIdToKey map
    if (notificationKeysToRemove.length != 0) {
      this.setState({
        activeIdToKey: R.omit(notificationKeysToRemove, activeIdToKey),
      })
    }
  }

  render() {
    return null
  }
}

const getNewNotifications = (
  notifications: NotificationType[],
  activeIdMap: { [id: string]: string }
) =>
  R.filter(
    notification => !R.has(notification.id as string, activeIdMap),
    notifications
  )

const getIdOfRemovedNotifications = (
  notifications: NotificationType[],
  activeIdMap: { [id: string]: string }
) =>
  R.filter(
    notificationId =>
      R.find(
        notification => notificationId == notification.id,
        notifications
      ) === undefined,
    R.keys(activeIdMap) as string[]
  )

const componentWithSnackebar = withSnackbar(Notifications as any)

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
)(componentWithSnackebar)
