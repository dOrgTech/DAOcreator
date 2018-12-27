export interface AppState {
  daoCreator: DaoCreatorState
  daoController: DaoControllerState
  notification: NotificationState
  waitingAnimation: WaitingAnimationState
}

import * as Arc from "src/lib/integrations/daoStack/arc"
export interface DaoCreatorState {
  step: number
  stepValidation: boolean[]
  naming: {
    daoName: string
    tokenName: string
    tokenSymbol: string
  }
  founders: Arc.Founder[]
  schemes: Arc.Scheme[]
  votingMachineConfiguration: Arc.VotingMachineConfiguration
  deployedDao: Arc.DAO | undefined
}

export interface DaoControllerState {
  // TODO: Add layer 2 types that make up this state
}

export interface NotificationState {
  message: string
  type: string
  open: boolean
}

export interface WaitingAnimationState {
  message: string
  type: string
  open: boolean
}
