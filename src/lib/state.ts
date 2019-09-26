import { Member, Scheme, DAOConfig } from "./dependency/arc";

export {
  SchemeType,
  ContributionReward,
  SchemeRegistrar,
  GenericScheme,
  GenesisProtocol,
  GenesisProtocolPreset
} from "./dependency/arc";

export type DAOConfig = DAOConfig;
export type Member = Member;
export type Scheme = Scheme;

export interface DAOcreatorState {
  config: DAOConfig;
  members: Member[];
  schemes: Scheme[];
}
