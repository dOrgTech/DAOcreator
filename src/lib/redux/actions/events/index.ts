import { Notification } from "../../../state";
import {
  Event,
  createEvent,
  PayloadEvent,
  createPayloadEvent
} from "./typeSafety";
import * as Arc from "../../../dependency/arc";

export enum Events {
  // DAO Creator
  DAO_CREATE_NEXT_STEP = "DAO_CREATE_NEXT_STEP",
  DAO_CREATE_PREV_STEP = "DAO_CREATE_PREV_STEP",
  DAO_CREATE_ADD_SCHEME = "DAO_CREATE_ADD_SCHEME",
  DAO_CREATE_REMOVE_SCHEME = "DAO_CREATE_REMOVE_SCHEME",
  DAO_CREATE_ADD_VOTE_MACHINE = "DAO_CREATE_ADD_VOTE_MACHINE",
  DAO_CREATE_SET_DEPLOYED_DAO = "DAO_CREATE_SET_DEPLOYED_DAO",
  DAO_CREATE_SET_STEP_VALIDATION = "DAO_CREATE_SET_STEP_VALIDATION",

  // Notifications
  NOTIFICATION_ADD = "NOTIFICATION_ADD",
  NOTIFICATION_REMOVE = "NOTIFICATION_REMOVE",

  // Waiting Animation
  WAITING_ANIMATION_OPEN = "WAITING_ANIMATION_OPEN",
  WAITING_ANIMATION_CLOSE = "WAITING_ANIMATION_CLOSE",
  WAITING_ANIMATION_SET_DETAILS = "WAITING_ANIMATION_SET_DETAILS"
}

// DAO Creator
interface DAO_CREATE_NEXT_STEP extends Event<string> {
  type: Events.DAO_CREATE_NEXT_STEP;
}
export const DAO_CREATE_NEXT_STEP = createEvent<DAO_CREATE_NEXT_STEP>(
  Events.DAO_CREATE_NEXT_STEP
);

interface DAO_CREATE_PREV_STEP extends Event<string> {
  type: Events.DAO_CREATE_PREV_STEP;
}
export const DAO_CREATE_PREV_STEP = createEvent<DAO_CREATE_PREV_STEP>(
  Events.DAO_CREATE_PREV_STEP
);

interface DAO_CREATE_ADD_SCHEME extends PayloadEvent<string, Arc.SchemeConfig> {
  type: Events.DAO_CREATE_ADD_SCHEME;
}
export const DAO_CREATE_ADD_SCHEME = createPayloadEvent<DAO_CREATE_ADD_SCHEME>(
  Events.DAO_CREATE_ADD_SCHEME
);

interface DAO_CREATE_REM_SCHEME extends PayloadEvent<string, string> {
  type: Events.DAO_CREATE_REMOVE_SCHEME;
}
export const DAO_CREATE_REM_SCHEME = createPayloadEvent<DAO_CREATE_REM_SCHEME>(
  Events.DAO_CREATE_REMOVE_SCHEME
);

interface DAO_CREATE_SET_DEPLOYED_DAO extends PayloadEvent<string, Arc.DAO> {
  type: Events.DAO_CREATE_SET_DEPLOYED_DAO;
}
export const DAO_CREATE_SET_DEPLOYED_DAO = createPayloadEvent<
  DAO_CREATE_SET_DEPLOYED_DAO
>(Events.DAO_CREATE_SET_DEPLOYED_DAO);

interface DAO_CREATE_SET_STEP_VALIDATION
  extends PayloadEvent<string, { step: number; isValid: boolean }> {
  type: Events.DAO_CREATE_SET_STEP_VALIDATION;
}
export const DAO_CREATE_SET_STEP_VALIDATION = createPayloadEvent<
  DAO_CREATE_SET_STEP_VALIDATION
>(Events.DAO_CREATE_SET_STEP_VALIDATION);

// Notifications
interface NOTIFICATION_ADD extends PayloadEvent<string, Notification> {
  type: Events.NOTIFICATION_ADD;
}
export const NOTIFICATION_ADD = createPayloadEvent<NOTIFICATION_ADD>(
  Events.NOTIFICATION_ADD
);

interface NOTIFICATION_REMOVE extends PayloadEvent<string, string> {
  type: Events.NOTIFICATION_REMOVE;
}
export const NOTIFICATION_REMOVE = createPayloadEvent<NOTIFICATION_REMOVE>(
  Events.NOTIFICATION_REMOVE
);

interface WAITING_ANIMATION_OPEN
  extends PayloadEvent<string, { type?: "transaction"; message: string }> {
  type: Events.WAITING_ANIMATION_OPEN;
}
export const WAITING_ANIMATION_OPEN = createPayloadEvent<
  WAITING_ANIMATION_OPEN
>(Events.WAITING_ANIMATION_OPEN);

interface WAITING_ANIMATION_CLOSE extends Event<string> {
  type: Events.WAITING_ANIMATION_CLOSE;
}
export const WAITING_ANIMATION_CLOSE = createEvent<WAITING_ANIMATION_CLOSE>(
  Events.WAITING_ANIMATION_CLOSE
);

interface WAITING_ANIMATION_SET_DETAILS extends PayloadEvent<string, string> {
  type: Events.WAITING_ANIMATION_SET_DETAILS;
}
export const WAITING_ANIMATION_SET_DETAILS = createPayloadEvent<
  WAITING_ANIMATION_SET_DETAILS
>(Events.WAITING_ANIMATION_SET_DETAILS);

export type AnyEvent =
  | DAO_CREATE_NEXT_STEP
  | DAO_CREATE_PREV_STEP
  | DAO_CREATE_ADD_SCHEME
  | DAO_CREATE_REM_SCHEME
  | DAO_CREATE_SET_DEPLOYED_DAO
  | DAO_CREATE_SET_STEP_VALIDATION
  | NOTIFICATION_ADD
  | NOTIFICATION_REMOVE
  | WAITING_ANIMATION_OPEN
  | WAITING_ANIMATION_CLOSE
  | WAITING_ANIMATION_SET_DETAILS;
