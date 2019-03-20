export enum Events {
  // DAO Creator
  DAO_CREATE_NEXT_STEP = "DAO_CREATE_NEXT_STEP",
  DAO_CREATE_PREV_STEP = "DAO_CREATE_PREV_STEP",
  DAO_CREATE_SET_NAME = "DAO_CREATE_SET_NAME",
  DAO_CREATE_SET_TOKEN = "DAO_CREATE_SET_TOKEN",
  DAO_CREATE_SET_TOKEN_SYM = "DAO_CREATE_SET_TOKEN_SYM",
  DAO_CREATE_ADD_FOUNDER = "DAO_CREATE_ADD_FOUNDER",
  DAO_CREATE_ADD_OR_UPDATE_SCHEME = "DAO_CREATE_ADD_SCHEME",
  DAO_CREATE_REM_SCHEME = "DAO_CREATE_REM_SCHEME",
  DAO_CREATE_ADD_VOTE_MACHINE = "DAO_CREATE_ADD_VOTE_MACHINE",
  DAO_CREATE_SET_DEPLOYED_DAO = "DAO_CREATE_SET_DEPLOYED_DAO",
  DAO_CREATE_SET_STEP_VALIDATION = "DAO_CREATE_SET_STEP_VALIDATION",

  // Notifications
  NOTIFICATION_INFO = "NOTIFICATION_INFO",
  NOTIFICATION_ERROR = "NOTIFICATION_ERROR",
  NOTIFICATION_CLOSE = "NOTIFICATION_CLOSE",

  // Waiting Animation
  WAITING_ANIMATION_OPEN = "OPEN_WAITING_ANIMATION",
  WAITING_ANIMATION_CLOSE = "CLOSE_WAITING_ANIMATION",
}

import {
  Event,
  createEvent,
  PayloadEvent,
  createPayloadEvent,
} from "./typeSafety"

// TODO: get layer 2 types instead? or UI types? I think layer 2 makes most sense...
import * as Arc from "../../../lib/integrations/daoStack/arc"

// DAO Creator
interface DAO_CREATE_NEXT_STEP extends Event<string> {
  type: Events.DAO_CREATE_NEXT_STEP
}
export const DAO_CREATE_NEXT_STEP = createEvent<DAO_CREATE_NEXT_STEP>(
  Events.DAO_CREATE_NEXT_STEP
)

interface DAO_CREATE_PREV_STEP extends Event<string> {
  type: Events.DAO_CREATE_PREV_STEP
}
export const DAO_CREATE_PREV_STEP = createEvent<DAO_CREATE_PREV_STEP>(
  Events.DAO_CREATE_PREV_STEP
)

interface DAO_CREATE_SET_NAME extends PayloadEvent<string, string> {
  type: Events.DAO_CREATE_SET_NAME
}
export const DAO_CREATE_SET_NAME = createPayloadEvent<DAO_CREATE_SET_NAME>(
  Events.DAO_CREATE_SET_NAME
)

interface DAO_CREATE_SET_TOKEN extends PayloadEvent<string, string> {
  type: Events.DAO_CREATE_SET_TOKEN
}
export const DAO_CREATE_SET_TOKEN = createPayloadEvent<DAO_CREATE_SET_TOKEN>(
  Events.DAO_CREATE_SET_TOKEN
)

interface DAO_CREATE_SET_TOKENSym extends PayloadEvent<string, string> {
  type: Events.DAO_CREATE_SET_TOKEN_SYM
}
export const DAO_CREATE_SET_TOKENSym = createPayloadEvent<
  DAO_CREATE_SET_TOKENSym
>(Events.DAO_CREATE_SET_TOKEN_SYM)

interface DAO_CREATE_ADD_FOUNDER extends PayloadEvent<string, Arc.Founder> {
  type: Events.DAO_CREATE_ADD_FOUNDER
}
export const DAO_CREATE_ADD_FOUNDER = createPayloadEvent<
  DAO_CREATE_ADD_FOUNDER
>(Events.DAO_CREATE_ADD_FOUNDER)

interface DAO_CREATE_ADD_SCHEME
  extends PayloadEvent<
    string,
    {
      scheme: Arc.Scheme
      votingMachine: Arc.VotingMachineConfiguration
    }
  > {
  type: Events.DAO_CREATE_ADD_OR_UPDATE_SCHEME
}
export const DAO_CREATE_ADD_SCHEME = createPayloadEvent<DAO_CREATE_ADD_SCHEME>(
  Events.DAO_CREATE_ADD_OR_UPDATE_SCHEME
)

interface DAO_CREATE_REM_SCHEME extends PayloadEvent<string, string> {
  type: Events.DAO_CREATE_REM_SCHEME
}
export const DAO_CREATE_REM_SCHEME = createPayloadEvent<DAO_CREATE_REM_SCHEME>(
  Events.DAO_CREATE_REM_SCHEME
)

interface DAO_CREATE_SET_DEPLOYED_DAO extends PayloadEvent<string, Arc.DAO> {
  type: Events.DAO_CREATE_SET_DEPLOYED_DAO
}
export const DAO_CREATE_SET_DEPLOYED_DAO = createPayloadEvent<
  DAO_CREATE_SET_DEPLOYED_DAO
>(Events.DAO_CREATE_SET_DEPLOYED_DAO)

interface DAO_CREATE_SET_STEP_VALIDATION
  extends PayloadEvent<string, { step: number; isValid: boolean }> {
  type: Events.DAO_CREATE_SET_STEP_VALIDATION
}
export const DAO_CREATE_SET_STEP_VALIDATION = createPayloadEvent<
  DAO_CREATE_SET_STEP_VALIDATION
>(Events.DAO_CREATE_SET_STEP_VALIDATION)

// Notifications
interface NOTIFICATION_INFO extends PayloadEvent<string, string> {
  type: Events.NOTIFICATION_INFO
}
export const NOTIFICATION_INFO = createPayloadEvent<NOTIFICATION_INFO>(
  Events.NOTIFICATION_INFO
)

interface NOTIFICATION_ERROR extends PayloadEvent<string, string> {
  type: Events.NOTIFICATION_ERROR
}
export const NOTIFICATION_ERROR = createPayloadEvent<NOTIFICATION_ERROR>(
  Events.NOTIFICATION_ERROR
)

interface NOTIFICATION_CLOSE extends Event<string> {
  type: Events.NOTIFICATION_CLOSE
}
export const NOTIFICATION_CLOSE = createEvent<NOTIFICATION_CLOSE>(
  Events.NOTIFICATION_CLOSE
)

interface WAITING_ANIMATION_OPEN
  extends PayloadEvent<string, { type?: "transaction"; message: string }> {
  type: Events.WAITING_ANIMATION_OPEN
}
export const WAITING_ANIMATION_OPEN = createPayloadEvent<
  WAITING_ANIMATION_OPEN
>(Events.WAITING_ANIMATION_OPEN)

interface WAITING_ANIMATION_CLOSE extends Event<string> {
  type: Events.WAITING_ANIMATION_CLOSE
}
export const WAITING_ANIMATION_CLOSE = createEvent<WAITING_ANIMATION_CLOSE>(
  Events.WAITING_ANIMATION_CLOSE
)

export type AnyEvent =
  | DAO_CREATE_NEXT_STEP
  | DAO_CREATE_PREV_STEP
  | DAO_CREATE_SET_NAME
  | DAO_CREATE_SET_TOKEN
  | DAO_CREATE_SET_TOKENSym
  | DAO_CREATE_ADD_FOUNDER
  | DAO_CREATE_ADD_SCHEME
  | DAO_CREATE_REM_SCHEME
  | DAO_CREATE_SET_DEPLOYED_DAO
  | DAO_CREATE_SET_STEP_VALIDATION
  | NOTIFICATION_INFO
  | NOTIFICATION_ERROR
  | NOTIFICATION_CLOSE
  | WAITING_ANIMATION_OPEN
  | WAITING_ANIMATION_CLOSE
