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
      return R.merge(state, {
        step: newStep,
        stepValidation:
          state.stepValidation.length >= newStep + 1
            ? state.stepValidation
            : R.append(true, state.stepValidation),
      })
    }
    case Events.DAO_CREATE_PREV_STEP:
      return R.merge(state, { step: state.step - 1 })
    case Events.DAO_CREATE_SET_NAME:
      return R.merge(state, {
        naming: R.merge(state.naming, { daoName: event.payload }),
      })
    case Events.DAO_CREATE_SET_TOKEN:
      return R.merge(state, {
        naming: R.merge(state.naming, { tokenName: event.payload }),
      })
    case Events.DAO_CREATE_SET_TOKEN_SYM:
      return R.merge(state, {
        naming: R.merge(state.naming, { tokenSymbol: event.payload }),
      })
    case Events.DAO_CREATE_ADD_FOUNDER:
      return R.merge(state, {
        founders: R.append(event.payload, state.founders),
      })
    case Events.DAO_CREATE_REM_FOUNDER:
      return R.merge(state, {
        founders: R.filter(
          founder => founder.address !== event.payload,
          state.founders
        ),
      })
    case Events.DAO_CREATE_ADD_SCHEME:
      return R.merge(state, {
        schemes: R.append(event.payload, state.schemes),
      })

    case Events.DAO_CREATE_REMOVE_SCHEME:
      return R.merge(state, {
        schemes: R.filter(
          schemeConfig => schemeConfig.id !== event.payload,
          state.schemes
        ),
      })
    case Events.DAO_CREATE_SET_DEPLOYED_DAO:
      return R.merge(state, { deployedDao: event.payload })
    case Events.DAO_CREATE_SET_STEP_VALIDATION:
      return R.merge(state, {
        stepValidation: R.update(
          event.payload.step,
          event.payload.isValid,
          state.stepValidation
        ),
      })
    default:
      return state
  }
}
