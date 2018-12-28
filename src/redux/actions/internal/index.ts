export enum Actions {
  // DAO Creator
  DAO_CREATE_NEXT_STEP = "DAO_CREATE_NEXT_STEP",
  DAO_CREATE_PREV_STEP = "DAO_CREATE_PREV_STEP",
  DAO_CREATE_SET_NAME = "DAO_CREATE_SET_NAME",
  DAO_CREATE_SET_TOKEN = "DAO_CREATE_SET_TOKEN",
  DAO_CREATE_SET_TOKEN_SYM = "DAO_CREATE_SET_TOKEN_SYM",
  DAO_CREATE_ADD_FOUNDER = "DAO_CREATE_ADD_FOUNDER",
  DAO_CREATE_ADD_SCHEMA = "DAO_CREATE_ADD_SCHEMA",
  DAO_CREATE_REM_SCHEMA = "DAO_CREATE_REM_SCHEMA",
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
  Action,
  AnyAction,
  createAction,
  PayloadAction,
  createPayloadAction,
} from "./typeSafety"

// TODO: get layer 2 types instead? or UI types? I think layer 2 makes most sense...
import * as Arc from "../../../lib/integrations/daoStack/arc"

// DAO Creator
export interface DaoCreateNextStep extends Action<string> {
  type: Actions.DAO_CREATE_NEXT_STEP
}
export const daoCreateNextStep = createAction<DaoCreateNextStep>(
  Actions.DAO_CREATE_NEXT_STEP
)

export interface DaoCreatePrevStep extends Action<string> {
  type: Actions.DAO_CREATE_PREV_STEP
}
export const daoCreatePrevStep = createAction<DaoCreatePrevStep>(
  Actions.DAO_CREATE_PREV_STEP
)

export interface DaoCreateSetName extends PayloadAction<string, string> {
  type: Actions.DAO_CREATE_SET_NAME
}
export const daoCreateSetName = createPayloadAction<DaoCreateSetName>(
  Actions.DAO_CREATE_SET_NAME
)

export interface DaoCreateSetToken extends PayloadAction<string, string> {
  type: Actions.DAO_CREATE_SET_TOKEN
}
export const daoCreateSetToken = createPayloadAction<DaoCreateSetToken>(
  Actions.DAO_CREATE_SET_TOKEN
)

export interface DaoCreateSetTokenSym extends PayloadAction<string, string> {
  type: Actions.DAO_CREATE_SET_TOKEN_SYM
}
export const daoCreateSetTokenSym = createPayloadAction<DaoCreateSetTokenSym>(
  Actions.DAO_CREATE_SET_TOKEN_SYM
)

export interface DaoCreateAddFounder
  extends PayloadAction<string, Arc.Founder> {
  type: Actions.DAO_CREATE_ADD_FOUNDER
}
export const daoCreateAddFounder = createPayloadAction<DaoCreateAddFounder>(
  Actions.DAO_CREATE_ADD_FOUNDER
)

export interface DaoCreateAddSchema extends PayloadAction<string, Arc.Schema> {
  type: Actions.DAO_CREATE_ADD_SCHEMA
}
export const daoCreateAddSchema = createPayloadAction<DaoCreateAddSchema>(
  Actions.DAO_CREATE_ADD_SCHEMA
)

export interface DaoCreateRemSchema extends PayloadAction<string, Arc.Schema> {
  type: Actions.DAO_CREATE_REM_SCHEMA
}
export const daoCreateRemSchema = createPayloadAction<DaoCreateRemSchema>(
  Actions.DAO_CREATE_REM_SCHEMA
)

export interface DaoCreateSetDeployedDao
  extends PayloadAction<string, Arc.DAO> {
  type: Actions.DAO_CREATE_SET_DEPLOYED_DAO
}
export const daoCreateSetDeployedDao = createPayloadAction<
  DaoCreateSetDeployedDao
>(Actions.DAO_CREATE_SET_DEPLOYED_DAO)

export interface DaoCreateAddVoteMachine
  extends PayloadAction<string, Arc.VotingMachineConfiguration> {
  type: Actions.DAO_CREATE_ADD_VOTE_MACHINE
}
export const daoCreateAddVoteMachine = createPayloadAction<
  DaoCreateAddVoteMachine
>(Actions.DAO_CREATE_ADD_VOTE_MACHINE)

export interface DaoCreateSetStepValidation
  extends PayloadAction<string, { step: number; isValide: boolean }> {
  type: Actions.DAO_CREATE_SET_STEP_VALIDATION
}
export const daoCreateSetStepValidation = createPayloadAction<
  DaoCreateSetStepValidation
>(Actions.DAO_CREATE_SET_STEP_VALIDATION)

// Notifications
export interface NotificationInfo extends PayloadAction<string, string> {
  type: Actions.NOTIFICATION_INFO
}
export const notificationInfo = createPayloadAction<NotificationInfo>(
  Actions.NOTIFICATION_INFO
)

export interface NotificationError extends PayloadAction<string, string> {
  type: Actions.NOTIFICATION_ERROR
}
export const notificationError = createPayloadAction<NotificationError>(
  Actions.NOTIFICATION_ERROR
)

export interface NotificationClose extends Action<string> {
  type: Actions.NOTIFICATION_CLOSE
}
export const NotificationClose = createAction<NotificationClose>(
  Actions.NOTIFICATION_CLOSE
)

export interface WaitingAnimationOpen
  extends PayloadAction<string, { type?: "transaction"; message: string }> {
  type: Actions.WAITING_ANIMATION_OPEN
}
export const waitingAnimationOpen = createPayloadAction<WaitingAnimationOpen>(
  Actions.WAITING_ANIMATION_OPEN
)

export interface WaitingAnimationClose extends Action<string> {
  type: Actions.WAITING_ANIMATION_CLOSE
}
export const waitingAnimationClose = createAction<WaitingAnimationClose>(
  Actions.WAITING_ANIMATION_CLOSE
)

export type AnyAction =
  | DaoCreateNextStep
  | DaoCreatePrevStep
  | DaoCreateSetName
  | DaoCreateSetToken
  | DaoCreateSetTokenSym
  | DaoCreateAddFounder
  | DaoCreateAddSchema
  | DaoCreateRemSchema
  | DaoCreateAddVoteMachine
  | DaoCreateSetDeployedDao
  | DaoCreateSetStepValidation
  | NotificationInfo
  | NotificationError
  | NotificationClose
  | WaitingAnimationOpen
  | WaitingAnimationClose
