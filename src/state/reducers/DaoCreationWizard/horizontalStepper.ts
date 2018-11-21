import * as R from "ramda"
import {
  STEPPER_NEXT,
  STEPPER_BACK,
  STEPPER_RESET,
} from "../../actions/DaoCreationWizard/horizontalStepper"

// TODO: add a max size based on the number of steps
const initialState = {
  step: 0,
}

export const horizontalStepperReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case STEPPER_NEXT:
      return R.merge(state, { step: state.step + 1 })
    case STEPPER_BACK:
      return R.merge(state, { step: state.step - 1 })
    case STEPPER_RESET:
      return R.merge(state, { step: 0 })
    default:
      return state
  }
}
