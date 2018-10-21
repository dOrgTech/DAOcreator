import * as R from "ramda";
import {
  NOTIFICATION_INFO,
  NOTIFICATION_ERROR,
  CLOSE_NOTIFICATION,
} from "../actions/notifications";

const initialState = {
  message: "",
  type: "",
  open: false,
};

export const notificationReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case NOTIFICATION_INFO:
      return { message: action.message, type: "info", open: true };
    case NOTIFICATION_ERROR:
      return { message: action.message, type: "error", open: true };
    case CLOSE_NOTIFICATION:
      return R.merge(state, { open: false });
    default:
      return state;
  }
};
