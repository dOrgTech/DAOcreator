import { Dispatch } from "redux"
import * as Actions from "./internal"
import { newNotificationInfo } from "./notifications"
import * as Arc from "../../lib/integrations/daoStack/arc"

export default interface DaoCreatorActions {
  nextStep(): Promise<void>
  prevStep(): Promise<void>
  setName(name: string): Promise<void>
  setTokenName(tokenName: string): Promise<void>
  setTokenSymbol(tokenSymbol: string): Promise<void>
  addFounder(founder: Arc.Founder): Promise<void>
  addSchema(schema: Arc.Schema): Promise<void>
  remSchema(schema: Arc.Schema): Promise<void>
  addVotingMachine(votingMachine: Arc.VotingMachine): Promise<void>
  createDao(): Promise<void>
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

export function addVotingMachine(
  votingMachine: Arc.VotingMachine
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Actions.daoCreateAddVoteMachine(votingMachine))
    return Promise.resolve()
  }
}

export function createDao(): (
  dispatch: Dispatch,
  getState: () => any /*TODO: make state type*/
) => Promise<string> {
  return async (dispatch: Dispatch, getState: () => any) => {
    const { naming, founders, schemas, votingMachine } = getState().daoCreator

    try {
      await Arc.createDao(naming, founders, schemas, votingMachine)
      return Promise.resolve("Success!")
    } catch (e) {
      newNotificationInfo("Failed to create DAO. Error: " + e.message)
      return Promise.resolve(e.message)
    }
  }
}
