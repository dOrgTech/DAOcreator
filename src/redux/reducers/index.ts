import * as notifications from "./notifications"
import * as daoCreator from "./daoCreator"
import * as waitingAnimation from "./waitingAnimation"
import { combineReducers } from "redux"

const reducer = combineReducers({
  notification: notifications.reducer,
  waitingAnimation: waitingAnimation.reducer,
  daoCreator: daoCreator.reducer,
})

export default reducer
