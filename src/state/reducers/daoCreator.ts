import * as R from "ramda"
import { STEP_NEXT, STEP_BACK } from "../actions/daoCreator"

const initialState = {
  step: 0,
  data: {},
}

export const daoCreatorReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case STEP_NEXT:
      const { data } = action.payload
      return R.merge(state, { step: state.step + 1, data })
    case STEP_BACK:
      return R.merge(state, { step: state.step - 1 })
    default:
      return state
  }
}
