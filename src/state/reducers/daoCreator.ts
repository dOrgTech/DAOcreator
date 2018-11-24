import * as R from "ramda"
import { STEP_NEXT, STEP_BACK } from "../actions/daoCreator"

const initialState = {
  step: 0,
}

export const daoCreatorReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case STEP_NEXT:
      return R.merge(state, { step: state.step + 1 })
    case STEP_BACK:
      return R.merge(state, { step: state.step - 1 })
    default:
      return state
  }
}
