import { Dispatch } from "redux"
import * as Events from "./events"
import { newNotificationInfo } from "./notifications"
import * as Arc from "../../lib/integrations/daoStack/arc"
import { AppState } from "../../AppState"

export default interface DaoCreatorActions {
  init(): (dispatch: Dispatch) => Promise<string>
  nextStep(): (dispatch: Dispatch) => Promise<void>
  prevStep(): (dispatch: Dispatch) => Promise<void>
  setName(name: string): (dispatch: Dispatch) => Promise<void>
  setTokenName(tokenName: string): (dispatch: Dispatch) => Promise<void>
  setTokenSymbol(tokenSymbol: string): (dispatch: Dispatch) => Promise<void>
  addFounder(founder: Arc.Founder): (dispatch: Dispatch) => Promise<void>
  addScheme(scheme: Arc.Scheme): (dispatch: Dispatch) => Promise<void>
  remScheme(scheme: Arc.Scheme): (dispatch: Dispatch) => Promise<void>
  setVotingMachine(
    votingMachine: Arc.VotingMachineConfiguration
  ): (dispatch: Dispatch) => Promise<void>
  createDao(): (dispatch: Dispatch, getState: () => AppState) => Promise<string>
  setStepIsValide(
    isValide: boolean
  ): (dispatch: Dispatch, getState: () => AppState) => Promise<void>
}

export function init(): (dispatch: Dispatch) => Promise<string> {
  return async (dispatch: Dispatch) => {
    dispatch(
      Events.WAITING_ANIMATION_OPEN({
        message: "Initializing Web3",
      })
    )
    try {
      await Arc.init()
      dispatch(Events.WAITING_ANIMATION_CLOSE())
      return Promise.resolve("Success!")
    } catch (e) {
      dispatch(Events.WAITING_ANIMATION_CLOSE())
      dispatch(
        Events.NOTIFICATION_ERROR("Failed to initialize. Error: " + e.message)
      )
      return Promise.resolve(e.message)
    }
  }
}

export function nextStep(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Events.DAO_CREATE_NEXT_STEP())
    return Promise.resolve()
  }
}

export function prevStep(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Events.DAO_CREATE_PREV_STEP())
    return Promise.resolve()
  }
}

export function setName(name: string): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Events.DAO_CREATE_SET_NAME(name))
    return Promise.resolve()
  }
}

export function setTokenName(
  tokenName: string
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Events.DAO_CREATE_SET_TOKEN(tokenName))
    return Promise.resolve()
  }
}

export function setTokenSymbol(
  tokenSymbol: string
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Events.DAO_CREATE_SET_TOKENSym(tokenSymbol))
    return Promise.resolve()
  }
}

export function addFounder(
  founder: Arc.Founder
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Events.DAO_CREATE_ADD_FOUNDER(founder))
    return Promise.resolve()
  }
}

export function addScheme(
  scheme: Arc.Scheme
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Events.DAO_CREATE_ADD_SCHEME(scheme))
    return Promise.resolve()
  }
}

export function remScheme(
  scheme: Arc.Scheme
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Events.DAO_CREATE_REM_SCHEME(scheme))
    return Promise.resolve()
  }
}

export function setVotingMachine(
  votingMachineConfiguration: Arc.VotingMachineConfiguration
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Events.DAO_CREATE_ADD_VOTE_MACHINE(votingMachineConfiguration))
    return Promise.resolve()
  }
}

export function createDao(): (
  dispatch: Dispatch,
  getState: () => AppState
) => Promise<string> {
  return async (dispatch: Dispatch, getState: () => AppState) => {
    dispatch(
      Events.WAITING_ANIMATION_OPEN({
        type: "transaction",
        message: "To create the DAO, please sign the upcoming transaction",
      })
    )
    const {
      naming,
      founders,
      schemes,
      votingMachineConfiguration,
    } = getState().daoCreator

    try {
      const dao = await Arc.createDao(
        naming,
        founders,
        schemes,
        votingMachineConfiguration
      )
      dispatch(Events.DAO_CREATE_SET_DEPLOYED_DAO(dao))
      dispatch(Events.DAO_CREATE_NEXT_STEP())
      dispatch(Events.WAITING_ANIMATION_CLOSE())
      return Promise.resolve("Success!")
    } catch (e) {
      dispatch(Events.WAITING_ANIMATION_CLOSE())
      dispatch(
        Events.NOTIFICATION_ERROR("Failed to create DAO. Error: " + e.message)
      )
      return Promise.resolve(e.message)
    }
  }
}

export function setStepIsValide(
  isValide: boolean
): (dispatch: Dispatch, getState: () => AppState) => Promise<void> {
  return (dispatch: Dispatch, getState: () => AppState) => {
    dispatch(
      Events.DAO_CREATE_SET_STEP_VALIDATION({
        step: getState().daoCreator.step,
        isValide,
      })
    )
    return Promise.resolve()
  }
}
