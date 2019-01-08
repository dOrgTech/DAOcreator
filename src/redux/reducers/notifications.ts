import { Events, AnyEvent } from "../../redux/actions"
import { NotificationState } from "../../AppState"

const initialState: NotificationState = {
  message: "",
  type: "info",
  open: false,
}

export const reducer = (
  state: NotificationState = initialState,
  event: AnyEvent
): NotificationState => {
  switch (event.type) {
    case Events.NOTIFICATION_INFO:
      return { message: event.payload, type: "info", open: true }
    case Events.NOTIFICATION_ERROR:
      return { message: event.payload, type: "error", open: true }
    case Events.NOTIFICATION_CLOSE:
      return { message: "", type: "info", open: false }
    default:
      return state
  }
}
