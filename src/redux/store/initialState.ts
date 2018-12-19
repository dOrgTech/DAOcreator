import { AppState } from "../../AppState"
import { votingMachines } from "src/lib/integrations/daoStack/arc"

// TODO: init to null to save on unneeded memory
// // figure out way of solving null cases easily
const initialState: AppState = {
  daoCreator: {
    step: 0,
    naming: {
      daoName: "",
      tokenName: "",
      tokenSymbol: "",
    },
    founders: [],
    schemas: [],
    votingMachine: votingMachines[0],
  },
  daoController: {},
  notification: {
    message: "",
    type: "",
    open: false,
  },
}

export default initialState
