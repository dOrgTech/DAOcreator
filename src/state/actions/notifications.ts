export const NOTIFICATION_INFO = "NOTIFICATION_INFO";
export const NOTIFICATION_ERROR = "NOTIFICATION_ERROR";
export const CLOSE_NOTIFICATION = "CLOSE_NOTIFICATION";

export const newNotificationInfo = (message: string) => ({
  type: NOTIFICATION_INFO,
  message,
});

export const newNotificationError = (message: string) => ({
  type: NOTIFICATION_ERROR,
  message,
});

export const closeNotification = () => ({
  type: CLOSE_NOTIFICATION,
});
