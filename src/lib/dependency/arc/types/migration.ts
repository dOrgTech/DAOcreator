import { Member, GenesisProtocolConfig } from "./index";

export interface DAOMigrationParams {
  orgName: string;
  tokenName: string;
  tokenSymbol: string;
  VotingMachinesParams: GenesisProtocolConfig[];
  schemes: {
    ContributionReward?: boolean;
    UGenericScheme?: boolean;
    SchemeRegistrar?: boolean;
  };
  ContributionReward?: {
    voteParams?: number;
  }[];
  UGenericScheme?: {
    voteParams?: number;
    targetContract: string;
  }[];
  SchemeRegistrar?: {
    voteRegisterParams?: number;
    voteRemoveParams?: number;
  }[];
  unregisterOwner: boolean;
  useUController: boolean;
  useDaoCreator: boolean;
  founders: Member[];
}

export interface DAOMigrationResult {
  arcVersion: string;
  name: string;
  avatar: Address;
  token: Address;
  reputation: Address;
  controller: Address;
  schemes: ?
}

export interface DAOMigrationCallbacks {
  userApproval: (msg: string) => Promise<boolean>;
  info: (msg: string) => void;
  error: (msg: string) => void;
  txComplete: (msg: string, txHash: string, txCost: number) => Promise<void>;
  migrationAborted: (err: Error) => void;
  migrationComplete: (result: DAOMigrationResult) => void;
}

export const toJSON = (params: DAOMigrationParams): string => {
  return JSON.stringify(params, null, 2);
};

export const fromJSON = (params: string): DAOMigrationParams => {
  return JSON.parse(params);
};
