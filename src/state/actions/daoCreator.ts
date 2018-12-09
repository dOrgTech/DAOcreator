import * as Arc from "../../integrations/arc.js"
import { NewDaoConfig } from "@daostack/arc.js"
import { newNotificationError } from "./notifications"

// Stepper
export const STEP_NEXT = "STEP_NEXT"
export const STEP_BACK = "STEP_BACK"
export const ADD_FOUNDER = "ADD_FOUNDER"
export const ADD_SCHEMA = "ADD_SCHEMA"
export const REMOVE_SCHEMA = "REMOVE_SCHEMA"

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
    Arc.createDao({
      name: daoName,
      // tokenCap?: BigNumber | string,
      tokenName,
      tokenSymbol,
      founders: Arc.toFounderConfigs(founders),
      // daoCreatorAddress?: Address,
      // universalController?: boolean,
      // votingMachineParams?: NewDaoVotingMachineConfig,
      // schemes?: Array<SchemeConfig>,
    } as NewDaoConfig)
  } catch (e) {
    newNotificationError("Failed to create DAO. With error: " + e.message)
  }
}

export const addFounder = (founder: Founder) => ({
  type: ADD_FOUNDER,
  payload: founder,
})

export const addSchema = (schemaName: string) => ({
  type: ADD_SCHEMA,
  payload: schemaName,
})

export const removeSchema = (schemaName: string) => ({
  type: REMOVE_SCHEMA,
  payload: schemaName,
})
