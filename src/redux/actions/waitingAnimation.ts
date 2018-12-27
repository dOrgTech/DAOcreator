import { Dispatch } from "redux"
import * as Actions from "./internal"

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
    dispatch(Actions.waitingAnimationOpen({ type, message }))
    return Promise.resolve()
  }
}

export function closeWaitingAnmiation(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Actions.waitingAnimationClose())
    return Promise.resolve()
  }
}
