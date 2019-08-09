import { Dispatch } from "redux"
import * as Events from "./events"

export default interface WaitingAnmiationActions {
  openWaitingAnimation(
    message: string,
    type?: "transaction"
  ): (dispatch: Dispatch) => Promise<void>
  closeWaitingAnimation(): (dispatch: Dispatch) => Promise<void>
}

export function openWaitingAnimation(
  message: string,
  type?: "transaction"
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Events.WAITING_ANIMATION_OPEN({ type, message }))
    return Promise.resolve()
  }
}

export function closeWaitingAnmiation(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Events.WAITING_ANIMATION_CLOSE())
    return Promise.resolve()
  }
}
