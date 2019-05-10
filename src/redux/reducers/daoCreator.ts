import * as R from "ramda"
import { Events, AnyEvent } from "../../redux/actions"
import { DAOcreatorState } from "../../state"

const initialState: DAOcreatorState = {
  step: 0,
  stepValidation: [false, false],
  naming: {
    daoName: "",
    tokenName: "",
    tokenSymbol: "",
  },
  founders: [],
  schemes: [],
  deployedDao: undefined,
}

export const reducer = (
  state: DAOcreatorState = initialState,
  event: AnyEvent
): DAOcreatorState => {
  switch (event.type) {
    case Events.DAO_CREATE_NEXT_STEP: {
      const newStep = state.step + 1
      return {
        ...state,
        step: newStep,
        stepValidation:
          state.stepValidation.length >= newStep + 1
            ? state.stepValidation
            : R.append(true, state.stepValidation),
      }
    }
    case Events.DAO_CREATE_PREV_STEP:
      return { ...state, step: state.step - 1 }
    case Events.DAO_CREATE_SET_NAME:
      return { ...state, naming: { ...state.naming, daoName: event.payload } }
    case Events.DAO_CREATE_SET_TOKEN:
      return { ...state, naming: { ...state.naming, tokenName: event.payload } }
    case Events.DAO_CREATE_SET_TOKEN_SYM:
      return {
        ...state,
        naming: { ...state.naming, tokenSymbol: event.payload },
      }
    case Events.DAO_CREATE_ADD_FOUNDER:
      return { ...state, founders: R.append(event.payload, state.founders) }
    case Events.DAO_CREATE_REM_FOUNDER:
      return {
        ...state,
        founders: R.filter(
          founder => founder.address !== event.payload,
          state.founders
        ),
      }
    case Events.DAO_CREATE_ADD_SCHEME:
      return { ...state, schemes: R.append(event.payload, state.schemes) }
    case Events.DAO_CREATE_REMOVE_SCHEME:
      return {
        ...state,
        schemes: R.filter(
          schemeConfig => schemeConfig.id !== event.payload,
          state.schemes
        ),
      }
    case Events.DAO_CREATE_SET_DEPLOYED_DAO:
      return { ...state, deployedDao: event.payload }
    case Events.DAO_CREATE_SET_STEP_VALIDATION:
      return {
        ...state,
        stepValidation: R.update(
          event.payload.step,
          event.payload.isValid,
          state.stepValidation
        ),
      }
    default:
      return state
  }
}
