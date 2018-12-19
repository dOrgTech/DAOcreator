import { Dispatch } from "redux"
import * as Actions from "./internal"

export default interface NotificationActions {
  newNotificationInfo(message: string): (dispatch: Dispatch) => Promise<void>
  newNotificationError(message: string): (dispatch: Dispatch) => Promise<void>
  closeNotification(): (dispatch: Dispatch) => Promise<void>
}

export function newNotificationInfo(
  message: string
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Actions.notificationInfo(message))
    return Promise.resolve()
  }
}

export function newNotificationError(
  message: string
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Actions.notificationError(message))
    return Promise.resolve()
  }
}

export function closeNotification(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Actions.NotificationClose())
    return Promise.resolve()
  }
}
