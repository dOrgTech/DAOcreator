import { notificationReducer } from "./notifications"
import { daoCreatorReducer } from "./daoCreator"
import { combineReducers } from "redux"

const reducer = combineReducers({
  notification: notificationReducer,
  horizontalStepper: daoCreatorReducer,
})

export default reducer
