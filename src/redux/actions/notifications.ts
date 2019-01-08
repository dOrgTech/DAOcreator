import { Dispatch } from "redux"
import * as Events from "./events"

export default interface NotificationActions {
  newNotificationInfo(message: string): (dispatch: Dispatch) => Promise<void>
  newNotificationError(message: string): (dispatch: Dispatch) => Promise<void>
  closeNotification(): (dispatch: Dispatch) => Promise<void>
}

export function newNotificationInfo(
  message: string
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Events.NOTIFICATION_INFO(message))
    return Promise.resolve()
  }
}

export function newNotificationError(
  message: string
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Events.NOTIFICATION_ERROR(message))
    return Promise.resolve()
  }
}

export function closeNotification(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Events.NOTIFICATION_CLOSE())
    return Promise.resolve()
  }
}
