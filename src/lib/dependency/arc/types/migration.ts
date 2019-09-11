import { Member, GenesisProtocolConfig } from "./index";

export interface DAOMigrationParams {
  orgName: string;
  tokenName: string;
  tokenSymbol: string;
  VotingMachinesParams: GenesisProtocolConfig[];
  schemes: {
    ContributionReward?: boolean;
    GenericScheme?: boolean;
    SchemeRegistrar?: boolean;
  };
  ContributionReward?: {
    voteParams?: number;
  };
  GenericScheme?: {
    voteParams?: number;
    targetContract: string;
  };
  SchemeRegistrar?: {
    voteRegisterParams?: number;
    voteRemoveParams?: number;
  };
  unregisterOwner: boolean;
  useUController: boolean;
  useDaoCreator: boolean;
  founders: Member[];
}

export const serialize = (params: DAOMigrationParams): string => {
  return JSON.stringify(params, null, 2);
};

export const deserialize = (params: string): DAOMigrationParams => {
  return JSON.parse(params);
};
