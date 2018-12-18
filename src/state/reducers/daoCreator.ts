import * as R from "ramda"
import {
  STEP_NEXT,
  STEP_BACK,
  ADD_DAO_NAME,
  ADD_TOKEN_NAME,
  ADD_TOKEN_SYMBOL,
  ADD_SCHEMA,
  ADD_FOUNDER,
  REMOVE_SCHEMA,
  SET_VOTING_MACHINE,
} from "../actions/daoCreator"
import {
  VotingMachine,
  votingMachines,
} from "../../lib/integrations/daoStack/arc.js"

type State = {
  step: number
  daoName: string
  tokenName: string
  tokenSymbol: string
  founders: Founder[]
  schemas: string[]
  votingMachine: VotingMachine
}

const initialState: State = {
  step: 0,
  daoName: "",
  tokenName: "",
  tokenSymbol: "",
  founders: [],
  schemas: [],
  votingMachine: votingMachines[0],
}

export const daoCreatorReducer = (
  state = initialState,
  action: ReduxAction
) => {
  switch (action.type) {
    case STEP_NEXT:
      return R.merge(state, { step: state.step + 1 })
    case STEP_BACK:
      return R.merge(state, { step: state.step - 1 })
    case ADD_DAO_NAME:
      return R.merge(state, { daoName: action.payload })
    case ADD_TOKEN_NAME:
      return R.merge(state, { tokenName: action.payload })
    case ADD_TOKEN_SYMBOL:
      return R.merge(state, { tokenSymbol: action.payload })
    case ADD_FOUNDER:
      return R.merge(state, {
        founders: R.append(action.payload, state.founders),
      })
    case ADD_SCHEMA:
      return R.merge(state, {
        schemas: R.append(action.payload, state.schemas),
      })
    case REMOVE_SCHEMA:
      return R.merge(state, {
        schemas: R.without([action.payload], state.schemas),
      })
    case SET_VOTING_MACHINE:
      return R.merge(state, {
        votingMachine: action.payload,
      })
    default:
      return state
  }
}
