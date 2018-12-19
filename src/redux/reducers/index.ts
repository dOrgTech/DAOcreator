import * as notifications from "./notifications"
import * as daoCreator from "./daoCreator"
import { combineReducers } from "redux"

const reducer = combineReducers({
  notification: notifications.reducer,
  daoCreator: daoCreator.reducer,
})

export default reducer
