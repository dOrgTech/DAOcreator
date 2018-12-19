import * as R from "ramda"
import { Actions, AnyAction } from "../actions"
import { DaoCreatorState } from "../../AppState"
import { votingMachines } from "src/lib/integrations/daoStack/arc"

const initialState: DaoCreatorState = {
  step: 0,
  naming: {
    daoName: "",
    tokenName: "",
    tokenSymbol: "",
  },
  founders: [],
  schemas: [],
  votingMachine: votingMachines[0],
  deployedDao: undefined,
}

export const reducer = (
  state: DaoCreatorState = initialState,
  action: AnyAction
): DaoCreatorState => {
  switch (action.type) {
    case Actions.DAO_CREATE_NEXT_STEP:
      return R.merge(state, { step: state.step + 1 })
    case Actions.DAO_CREATE_PREV_STEP:
      return R.merge(state, { step: state.step + 1 })
    case Actions.DAO_CREATE_SET_NAME:
      return R.merge(state, {
        naming: R.merge(state.naming, { daoName: action.payload }),
      })
    case Actions.DAO_CREATE_SET_TOKEN:
      return R.merge(state, {
        naming: R.merge(state.naming, { tokenName: action.payload }),
      })
    case Actions.DAO_CREATE_SET_TOKEN_SYM:
      return R.merge(state, {
        naming: R.merge(state.naming, { tokenSymbol: action.payload }),
      })
    case Actions.DAO_CREATE_ADD_FOUNDER:
      return R.merge(state, {
        founders: R.append(action.payload, state.founders),
      })
    case Actions.DAO_CREATE_ADD_SCHEMA:
      return R.merge(state, {
        schemas: R.append(action.payload, state.schemas),
      })
    case Actions.DAO_CREATE_REM_SCHEMA:
      return R.merge(state, {
        schemas: R.without([action.payload], state.schemas),
      })
    case Actions.DAO_CREATE_ADD_VOTE_MACHINE:
      return R.merge(state, { votingMachine: action.payload })
    case Actions.DAO_CREATE_SET_DEPLOYED_DAO:
      return R.merge(state, { deployedDao: action.payload })
    default:
      return state
  }
}
