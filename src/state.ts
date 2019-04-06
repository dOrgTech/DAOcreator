import { Notification } from "./redux/reducers/notifications"
export interface RootState {
  daoCreator: DAOcreatorState
  daoController: DaoControllerState
  notification: NotificationState
  waitingAnimation: WaitingAnimationState
}

import * as Arc from "./lib/integrations/daoStack/arc"
export interface DAOcreatorState {
  step: number
  stepValidation: boolean[]
  naming: {
    daoName: string
    tokenName: string
    tokenSymbol: string
  }
  founders: Arc.Founder[]
  schemes: {
    scheme: Arc.Scheme
    votingMachineConfig: Arc.VotingMachineConfiguration
  }[]
  deployedDao: Arc.DAO | undefined
}

export interface DaoControllerState {
  // TODO: Add layer 2 types that make up this state
}

export interface NotificationState {
  notifications: { [id: string]: Notification }
}

export interface WaitingAnimationState {
  message: string
  details?: string
  type?: "transaction"
  open: boolean
}
