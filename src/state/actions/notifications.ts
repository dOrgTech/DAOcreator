export const NOTIFICATION_INFO = "NOTIFICATION_INFO"
export const NOTIFICATION_ERROR = "NOTIFICATION_ERROR"
export const CLOSE_NOTIFICATION = "CLOSE_NOTIFICATION"

export const newNotificationInfo = (message: string): ReduxAction => ({
  type: NOTIFICATION_INFO,
  payload: message,
})

export const newNotificationError = (message: string): ReduxAction => ({
  type: NOTIFICATION_ERROR,
  payload: message,
})

export const closeNotification = () => ({
  type: CLOSE_NOTIFICATION,
})
