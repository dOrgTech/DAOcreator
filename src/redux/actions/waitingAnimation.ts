import { Dispatch } from "redux"
import * as Actions from "./internal"

export default interface WaitingAnmiationActions {
  openWaitingAnimation(
    type: string,
    message: string
  ): (dispatch: Dispatch) => Promise<void>
  closeWaitingAnimation(): (dispatch: Dispatch) => Promise<void>
}

export function openWaitingAnimation(
  type: string,
  message: string
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
