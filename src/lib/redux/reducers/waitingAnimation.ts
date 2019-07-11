import { Events, AnyEvent } from "../actions"
import { WaitingAnimationState } from "../state"

const initialState: WaitingAnimationState = {
  message: "",
  details: "",
  open: false,
}

export const reducer = (
  state: WaitingAnimationState = initialState,
  event: AnyEvent
): WaitingAnimationState => {
  switch (event.type) {
    case Events.WAITING_ANIMATION_OPEN:
      return {
        message: event.payload.message,
        type: event.payload.type,
        open: true,
      }
    case Events.WAITING_ANIMATION_CLOSE:
      return { message: "", open: false }
    case Events.WAITING_ANIMATION_SET_DETAILS:
      return { ...state, details: event.payload }
    default:
      return state
  }
}
