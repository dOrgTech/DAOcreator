import { notificationReducer } from "./notifications"
import { daoCreatorReducer } from "./daoCreator"
import { combineReducers } from "redux"

const reducer = combineReducers({
  notification: notificationReducer,
  daoCreator: daoCreatorReducer,
})

export default reducer
