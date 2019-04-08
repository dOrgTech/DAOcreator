import { Dispatch } from "redux"
import * as Events from "./events"
import { Notification } from "../reducers/notifications"
import uuid from "uuid"
import * as R from "ramda"

export default interface NotificationActions {
  addNotification(
    notification: Notification
  ): (dispatch: Dispatch) => Promise<string>
  removeNotification(id: string): (dispatch: Dispatch) => Promise<void>
}

// Adds a notifcation and returns its id
export function addNotification(
  notification: Notification
): (dispatch: Dispatch) => Promise<string> {
  return (dispatch: Dispatch) => {
    const id = uuid()
    dispatch(Events.NOTIFICATION_ADD(R.assoc("id", id, notification)))
    return Promise.resolve(id)
  }
}

export function removeNotification(
  id: string
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Events.NOTIFICATION_REMOVE(id))
    return Promise.resolve()
  }
}
