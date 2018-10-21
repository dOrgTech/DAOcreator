import { notificationReducer } from "./notifications";
import { combineReducers } from "redux";

const reducer = combineReducers({
  notification: notificationReducer
});

export default reducer;
