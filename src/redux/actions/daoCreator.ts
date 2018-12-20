import { Dispatch } from "redux"
import * as Actions from "./internal"
import { newNotificationInfo } from "./notifications"
import * as Arc from "../../lib/integrations/daoStack/arc"
import { AppState } from "src/AppState"

export default interface DaoCreatorActions {
  nextStep(): (dispatch: Dispatch) => Promise<void>
  prevStep(): (dispatch: Dispatch) => Promise<void>
  setName(name: string): (dispatch: Dispatch) => Promise<void>
  setTokenName(tokenName: string): (dispatch: Dispatch) => Promise<void>
  setTokenSymbol(tokenSymbol: string): (dispatch: Dispatch) => Promise<void>
  addFounder(founder: Arc.Founder): (dispatch: Dispatch) => Promise<void>
  addSchema(schema: Arc.Schema): (dispatch: Dispatch) => Promise<void>
  remSchema(schema: Arc.Schema): (dispatch: Dispatch) => Promise<void>
  setVotingMachine(
    votingMachine: Arc.VotingMachine
  ): (dispatch: Dispatch) => Promise<void>
  createDao(): (dispatch: Dispatch, getState: () => AppState) => Promise<string>
  setStepIsValide(
    isValide: boolean
  ): (dispatch: Dispatch, getState: () => AppState) => Promise<void>
}

export function nextStep(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Actions.daoCreateNextStep())
    return Promise.resolve()
  }
}

export function prevStep(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Actions.daoCreatePrevStep())
    return Promise.resolve()
  }
}

export function setName(name: string): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Actions.daoCreateSetName(name))
    return Promise.resolve()
  }
}

export function setTokenName(
  tokenName: string
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Actions.daoCreateSetToken(tokenName))
    return Promise.resolve()
  }
}

export function setTokenSymbol(
  tokenSymbol: string
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Actions.daoCreateSetTokenSym(tokenSymbol))
    return Promise.resolve()
  }
}

export function addFounder(
  founder: Arc.Founder
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Actions.daoCreateAddFounder(founder))
    return Promise.resolve()
  }
}

export function addSchema(
  schema: Arc.Schema
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Actions.daoCreateAddSchema(schema))
    return Promise.resolve()
  }
}

export function remSchema(
  schema: Arc.Schema
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Actions.daoCreateRemSchema(schema))
    return Promise.resolve()
  }
}

export function setVotingMachine(
  votingMachine: Arc.VotingMachine
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Actions.daoCreateAddVoteMachine(votingMachine))
    return Promise.resolve()
  }
}

export function createDao(): (
  dispatch: Dispatch,
  getState: () => AppState
) => Promise<string> {
  return async (dispatch: Dispatch, getState: () => AppState) => {
    const { naming, founders, schemas, votingMachine } = getState().daoCreator

    try {
      const dao = await Arc.createDao(naming, founders, schemas, votingMachine)
      dispatch(Actions.daoCreateSetDeployedDao(dao))
      dispatch(Actions.daoCreateNextStep())
      return Promise.resolve("Success!")
    } catch (e) {
      newNotificationInfo("Failed to create DAO. Error: " + e.message)
      dispatch(Actions.daoCreateNextStep())
      return Promise.reject(e.message)
    }
  }
}

export function setStepIsValide(
  isValide: boolean
): (dispatch: Dispatch, getState: () => AppState) => Promise<void> {
  return (dispatch: Dispatch, getState: () => AppState) => {
    dispatch(
      Actions.daoCreateSetStepValidation({
        step: getState().daoCreator.step,
        isValide,
      })
    )
    return Promise.resolve()
  }
}
