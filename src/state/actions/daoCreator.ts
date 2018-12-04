import * as Ark from "../../integrations/arkJs"
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

export const createDao = () => async (dispatch: any, getState: any) => {
  const {
    daoName,
    tokenName,
    tokenSymbol,
    founders,
  } = getState().daoCreator.data
  Ark.createDao({ name: daoName, tokenName, tokenSymbol, founders })
}
