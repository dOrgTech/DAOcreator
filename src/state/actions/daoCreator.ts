import * as Arc from "../../integrations/arc.js"
import { NewDaoConfig } from "@daostack/arc.js"
import { newNotificationError } from "./notifications"

// Stepper
export const STEP_NEXT = "STEP_NEXT"
export const STEP_BACK = "STEP_BACK"
export const ADD_DAO_NAME = "ADD_DAO_NAME"
export const ADD_TOKEN_NAME = "ADD_TOKEN_NAME"
export const ADD_TOKEN_SYMBOL = "ADD_TOKEN_SYMBOL"
export const ADD_FOUNDER = "ADD_FOUNDER"
export const ADD_SCHEMA = "ADD_SCHEMA"
export const REMOVE_SCHEMA = "REMOVE_SCHEMA"

export const stepNext = () => ({
  type: STEP_NEXT,
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

export const addDaoName = (daoName: string) => ({
  type: ADD_DAO_NAME,
  payload: daoName,
})

export const addTokenName = (tokenName: string) => ({
  type: ADD_TOKEN_NAME,
  payload: tokenName,
})

export const addTokenSymbol = (tokenSymbol: string) => ({
  type: ADD_TOKEN_SYMBOL,
  payload: tokenSymbol,
})

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
