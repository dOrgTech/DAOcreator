import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { History } from "history";

const reducer = (history: History) =>
  combineReducers({
    router: connectRouter(history)
  });

export default reducer;
