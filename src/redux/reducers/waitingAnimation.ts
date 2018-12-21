import { Actions, AnyAction } from "../actions"
import { WaitingAnimationState } from "../../AppState"

const initialState: WaitingAnimationState = {
  message: "",
  type: "",
  open: false,
}

export const reducer = (
  state: WaitingAnimationState = initialState,
  action: AnyAction
): WaitingAnimationState => {
  switch (action.type) {
    case Actions.WAITING_ANIMATION_OPEN:
      return {
        message: action.payload.message,
        type: action.payload.type,
        open: true,
      }
    case Actions.WAITING_ANIMATION_CLOSE:
      return { message: "", type: "", open: false }
    default:
      return state
  }
}
