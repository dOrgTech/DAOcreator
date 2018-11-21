export const STEPPER_NEXT = "STEPPER_NEXT"
export const STEPPER_BACK = "STEPPER_BACK"
export const STEPPER_RESET = "STEPPER_RESET"

export const stepperNext = () => ({
  type: STEPPER_NEXT,
})

export const stepperBack = () => ({
  type: STEPPER_BACK,
})

export const stepperReset = () => ({
  type: STEPPER_RESET,
})
