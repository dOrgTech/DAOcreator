export interface RootState {
  daoCreator: DAOcreatorState
  notification: NotificationState
  waitingAnimation: WaitingAnimationState
}

import * as Arc from "../integrations/arc"
export type DAOConfig = Arc.DAOConfig
export type DAOFounder = Arc.Founder
export type DAOScheme = Arc.SchemeConfig
export interface DAOcreatorState {
  config: DAOConfig
  founders: DAOFounder[]
  schemes: DAOScheme[]
  deployedDao: Arc.DAO | undefined
}

// TODO: move this out of global state
// Move this into a component and use it in the root of a tool's view
export interface Notification {
  id?: string
  message: string
  type: "default" | "error" | "success" | "warning" | "info"
  duration?: number // ms it will display. Persist overrides this
  persist?: boolean // displaying until its explicitly closed
}

export interface NotificationState {
  notifications: { [id: string]: Notification }
}

// TODO: move this out of global state
// Wrap a view in a loading component instead
export interface WaitingAnimationState {
  message: string
  details?: string
  type?: "transaction"
  open: boolean
}
