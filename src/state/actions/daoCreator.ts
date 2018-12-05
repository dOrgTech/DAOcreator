import * as Ark from "../../integrations/arkJs"
import * as ArkBridge from "../../bridges/arkJs"
import { NewDaoConfig } from "@daostack/arc.js"

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

  try {
    Ark.createDao({
      name: daoName,
      // tokenCap?: BigNumber | string,
      tokenName,
      tokenSymbol,
      founders: ArkBridge.toFounderConfigs(founders),
      // daoCreatorAddress?: Address,
      // universalController?: boolean,
      // votingMachineParams?: NewDaoVotingMachineConfig,
      // schemes?: Array<SchemeConfig>,
    } as NewDaoConfig)
  } catch (e) {
    // TODO @Asgeir: report back errors to the invoking front-end logic. How?
  }
}
