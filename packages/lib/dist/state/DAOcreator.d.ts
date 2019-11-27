import {
  DAOConfig,
  DAOMigrationParams,
  Member,
  Scheme
} from "../dependency/arc";
export {
  SchemeType,
  ContributionReward,
  SchemeRegistrar,
  GenericScheme,
  GenesisProtocol,
  GenesisProtocolPreset
} from "../dependency/arc";
export interface DAOcreatorState {
  config: DAOConfig;
  members: Member[];
  schemes: Scheme[];
}
export declare const toDAOMigrationParams: (
  dao: DAOcreatorState
) => DAOMigrationParams;
export declare const fromDAOMigrationParams: (
  params: DAOMigrationParams
) => DAOcreatorState;
