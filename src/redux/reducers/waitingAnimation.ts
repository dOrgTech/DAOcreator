import { Events, AnyEvent } from "../../redux/actions"
import { WaitingAnimationState } from "../../state"

const initialState: WaitingAnimationState = {
  message: "",
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
    default:
      return state
  }
}
