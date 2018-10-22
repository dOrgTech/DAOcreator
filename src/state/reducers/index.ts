import { notificationReducer } from "./notifications";
import { web3Reducer } from "./web3";
import { combineReducers } from "redux";

const reducer = combineReducers({
  notification: notificationReducer,
  web3: web3Reducer,
});

export default reducer;
