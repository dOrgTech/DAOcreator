import { Actions, AnyAction } from "../../redux/actions"
import { NotificationState } from "../../AppState"

const initialState: NotificationState = {
  message: "",
  type: "info",
  open: false,
}

export const reducer = (
  state: NotificationState = initialState,
  action: AnyAction
): NotificationState => {
  switch (action.type) {
    case Actions.NOTIFICATION_INFO:
      return { message: action.payload, type: "info", open: true }
    case Actions.NOTIFICATION_ERROR:
      return { message: action.payload, type: "error", open: true }
    case Actions.NOTIFICATION_CLOSE:
      return { message: "", type: "info", open: false }
    default:
      return state
  }
}
