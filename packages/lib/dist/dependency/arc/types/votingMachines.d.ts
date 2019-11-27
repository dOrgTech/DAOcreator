import { Address } from "../../../dependency/web3";
export interface VotingMachine {
  typeName: string;
}
export interface GenesisProtocolConfig {
  queuedVoteRequiredPercentage: number;
  queuedVotePeriodLimit: number;
  thresholdConst: number;
  proposingRepReward: number;
  minimumDaoBounty: number;
  boostedVotePeriodLimit: number;
  daoBountyConst: number;
  activationTime: number;
  preBoostedVotePeriodLimit: number;
  quietEndingPeriod: number;
  voteOnBehalf: Address;
  votersReputationLossRatio: number;
}
export declare enum GenesisProtocolPreset {
  Easy = 1,
  Normal = 2,
  Critical = 3
}
export interface GenesisProtocolOpts {
  config?: GenesisProtocolConfig;
  preset?: GenesisProtocolPreset;
}
export declare class GenesisProtocol implements VotingMachine {
  typeName: string;
  config: GenesisProtocolConfig;
  preset?: GenesisProtocolPreset;
  static readonly EasyConfig: GenesisProtocolConfig;
  static readonly NormalConfig: GenesisProtocolConfig;
  static readonly CriticalConfig: GenesisProtocolConfig;
  constructor(opts: GenesisProtocolOpts);
}
