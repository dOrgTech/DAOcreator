import * as notifications from "./notifications";
import * as waitingAnimation from "./waitingAnimation";
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { History } from "history";

const reducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),

    notification: notifications.reducer,
    waitingAnimation: waitingAnimation.reducer
  });

export default reducer;
