import * as R from "ramda"
import {
  STEP_NEXT,
  STEP_BACK,
  SET_DAO_NAME,
  SET_TOKEN_NAME,
  SET_TOKEN_SYMBOL,
  ADD_FOUNDER_ADDRESS,
  REMOVE_FOUNDER_ADDRESS,
} from "../actions/daoCreator"

const initialState = {
  step: 0,
  daoName: "",
  tokenName: "",
  tokenSymbol: "",
  founders: [] as Agent[],
}

export const daoCreatorReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case STEP_NEXT:
      return R.merge(state, { step: state.step + 1 })
    case STEP_BACK:
      return R.merge(state, { step: state.step - 1 })
    case SET_DAO_NAME:
      return R.merge(state, { daoName: action.value })
    case SET_TOKEN_NAME:
      return R.merge(state, { tokenName: action.value })
    case SET_TOKEN_SYMBOL:
      return R.merge(state, { tokenSymbol: action.value })
    case ADD_FOUNDER_ADDRESS:
      return R.merge(state, { founders: [state.founders, ...action.value] })
    case REMOVE_FOUNDER_ADDRESS:
      return R.merge(state, {
        founders: R.reject(el => el === action.value, state.founders),
      })
    default:
      return state
  }
}
