import { Events, AnyEvent } from "../actions"
import { NotificationState } from "../state"
import * as R from "ramda"

const initialState: NotificationState = {
  notifications: {},
}

export const reducer = (
  state: NotificationState = initialState,
  event: AnyEvent
): NotificationState => {
  switch (event.type) {
    case Events.NOTIFICATION_ADD:
      return {
        notifications: R.assoc(
          event.payload.id as string,
          event.payload,
          state.notifications
        ),
      }
    case Events.NOTIFICATION_REMOVE:
      return {
        notifications: R.dissoc(event.payload, state.notifications),
      }
    default:
      return state
  }
}
