// Stepper
export const STEP_NEXT = "STEP_NEXT"
export const STEP_BACK = "STEP_BACK"

export const stepNext = (data: any) => ({
  type: STEP_NEXT,
  payload: data,
})

export const stepBack = () => ({
  type: STEP_BACK,
})
