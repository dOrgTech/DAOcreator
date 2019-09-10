import { DAOConfig, Member, Scheme } from "./dependency/arc";
import { GenesisProtocolForm } from "./forms";

export {
  SchemeType,
  ContributionReward,
  SchemeRegistrar,
  GenericScheme,
  GenesisProtocol
} from "./dependency/arc";

export type DAOConfig = DAOConfig;
export type Member = Member;
export type Scheme = Scheme;

export interface DAOcreatorState {
  config: DAOConfig;
  members: Member[];
  schemes: Scheme[];
}

export interface DAOMigrationParams {
  orgName: string;
  tokenName: string;
  tokenSymbol: string;
  VotingMachinesParams: GenesisProtocolForm[];
  schemes: {
    ContributionReward?: boolean;
    GenericScheme?: boolean;
    SchemeRegistrar?: boolean;
  };
  ContributionReward?: {
    voteParams: number;
  };
  GenericScheme?: {
    voteParams: number;
    targetContract: string;
  };
  SchemeRegistrar?: {
    voteParams: number;
  };
  unregisterOwner: boolean;
  useUController: boolean;
  useDaoCreator: boolean;
  founders: Member[];
}
