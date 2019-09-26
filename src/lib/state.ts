import {
  ExpertDAOConfig,
  Member,
  Scheme,
  SimpleDAOConfig
} from "./dependency/arc";

export {
  SchemeType,
  ContributionReward,
  SchemeRegistrar,
  GenericScheme,
  GenesisProtocol,
  GenesisProtocolPreset
} from "./dependency/arc";

export type ExpertDAOConfig = ExpertDAOConfig;
export type SimpleDAOConfig = SimpleDAOConfig;
export type Member = Member;
export type Scheme = Scheme;

export interface DAOcreatorState {
  config: ExpertDAOConfig | SimpleDAOConfig;
  members: Member[];
  schemes: Scheme[];
}
