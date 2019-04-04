import { Dispatch } from "redux"
import * as Events from "./events"
import { RootState } from "../../state"
import * as Arc from "../../lib/integrations/daoStack/arc"
import * as Web3 from "../../lib/integrations/web3"

export default interface DAOcreatorActions {
  init(): (dispatch: Dispatch) => Promise<void>
  nextStep(): (dispatch: Dispatch) => Promise<void>
  prevStep(): (dispatch: Dispatch) => Promise<void>
  setName(name: string): (dispatch: Dispatch) => Promise<void>
  setTokenName(tokenName: string): (dispatch: Dispatch) => Promise<void>
  setTokenSymbol(tokenSymbol: string): (dispatch: Dispatch) => Promise<void>
  addFounder(founder: Arc.Founder): (dispatch: Dispatch) => Promise<void>
  addOrUpdateScheme(
    scheme: Arc.Scheme,
    votingMachineConfig: Arc.VotingMachineConfiguration
  ): (dispatch: Dispatch) => Promise<void>
  remScheme(schemeTypeName: string): (dispatch: Dispatch) => Promise<void>
  createDao(): (
    dispatch: Dispatch,
    getState: () => RootState
  ) => Promise<string>
  setStepIsValid(
    isValid: boolean
  ): (dispatch: Dispatch, getState: () => RootState) => Promise<void>
}

export function init(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    return new Promise(async (resolve, reject) => {
      dispatch(
        Events.WAITING_ANIMATION_OPEN({
          message: "Initializing Web3",
        })
      )
      return Web3.getWeb3()
        .then(resolve)
        .catch(reject)
    })
      .then((web3: any) => Arc.init(web3))
      .catch(e => {
        dispatch(Events.NOTIFICATION_ERROR("Failed to initialize. Error: " + e))
        return Promise.resolve()
      })
      .finally(() => {
        dispatch(Events.WAITING_ANIMATION_CLOSE())
      })
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

export function addOrUpdateScheme(
  scheme: Arc.Scheme,
  votingMachineConfig: Arc.VotingMachineConfiguration
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Events.DAO_CREATE_ADD_SCHEME({ scheme, votingMachineConfig }))
    return Promise.resolve()
  }
}

export function remScheme(
  schemeTypeName: string
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(Events.DAO_CREATE_REM_SCHEME(schemeTypeName))
    return Promise.resolve()
  }
}

export function createDao(): (
  dispatch: Dispatch,
  getState: () => RootState
) => Promise<string> {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(
      Events.WAITING_ANIMATION_OPEN({
        type: "transaction",
        message: "To create the DAO, please sign the upcoming transaction",
      })
    )
    const { naming, founders, schemes } = getState().daoCreator
    const waitingDetailsUpdater = (newStatus: string) =>
      dispatch(Events.WAITING_ANIMATION_SET_DETAILS(newStatus))

    try {
      const web3 = await Web3.getWeb3()
      const dao = await Arc.createDao(web3, waitingDetailsUpdater)(
        naming,
        founders,
        schemes
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

export function setStepIsValid(
  isValid: boolean
): (dispatch: Dispatch, getState: () => RootState) => Promise<void> {
  return (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(
      Events.DAO_CREATE_SET_STEP_VALIDATION({
        step: getState().daoCreator.step,
        isValid,
      })
    )
    return Promise.resolve()
  }
}
