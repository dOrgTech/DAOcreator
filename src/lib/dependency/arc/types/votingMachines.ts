import { Address } from "lib/dependency/web3";

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

export enum GenesisProtocolPreset {
  Easy = 1,
  Normal,
  Critical
}

export interface GenesisProtocolOpts {
  config?: GenesisProtocolConfig;
  preset?: GenesisProtocolPreset;
}

export class GenesisProtocol implements VotingMachine {
  public typeName: string = "GenesisProtocol";
  public config: GenesisProtocolConfig;
  public preset?: GenesisProtocolPreset;

  public static get EasyConfig(): GenesisProtocolConfig {
    return {
      boostedVotePeriodLimit: 129600, // 1.5 days
      daoBountyConst: 10,
      minimumDaoBounty: 50, // 50 GEN
      queuedVotePeriodLimit: 604800, // 7 days
      queuedVoteRequiredPercentage: 50, // 50%
      preBoostedVotePeriodLimit: 43200, // 12 hours
      proposingRepReward: 10, // 10 REP
      quietEndingPeriod: 86400, // 1 day
      thresholdConst: 1200,
      votersReputationLossRatio: 1, // 1%
      voteOnBehalf: "0x0000000000000000000000000000000000000000",
      activationTime: 0
    };
  }

  public static get NormalConfig(): GenesisProtocolConfig {
    return {
      boostedVotePeriodLimit: 345600, // 4 days
      daoBountyConst: 10,
      minimumDaoBounty: 150, // 150 GEN
      queuedVotePeriodLimit: 2592000, // 30 days
      queuedVoteRequiredPercentage: 50, // 50%
      preBoostedVotePeriodLimit: 86400, // 1 day
      proposingRepReward: 50, // 50 REP
      quietEndingPeriod: 172800, // 2 day
      thresholdConst: 1200,
      votersReputationLossRatio: 4, // 4%
      voteOnBehalf: "0x0000000000000000000000000000000000000000",
      activationTime: 0
    };
  }

  public static get CriticalConfig(): GenesisProtocolConfig {
    return {
      boostedVotePeriodLimit: 691200, // 8 days
      daoBountyConst: 10,
      minimumDaoBounty: 500, // 500 GEN
      queuedVotePeriodLimit: 5184000, // 60 days
      queuedVoteRequiredPercentage: 50, // 50%
      preBoostedVotePeriodLimit: 172800, // 2 day
      proposingRepReward: 200, // 200 REP
      quietEndingPeriod: 345600, // 4 day
      thresholdConst: 1500,
      votersReputationLossRatio: 4, // 4%
      voteOnBehalf: "0x0000000000000000000000000000000000000000",
      activationTime: 0
    };
  }

  constructor(opts: GenesisProtocolOpts) {
    if (opts.preset) {
      if (typeof opts.preset === "string") {
        opts.preset = Number(opts.preset);
      }

      this.preset = opts.preset;

      switch (opts.preset) {
        case GenesisProtocolPreset.Easy:
          this.config = GenesisProtocol.EasyConfig;
          break;
        case GenesisProtocolPreset.Normal:
          this.config = GenesisProtocol.NormalConfig;
          break;
        case GenesisProtocolPreset.Critical:
          this.config = GenesisProtocol.CriticalConfig;
          break;
        default:
          throw Error("Preset not implemented.");
      }
    } else if (opts.config) {
      this.config = opts.config;
    } else {
      throw Error(
        "Invalid construction arguments. Please use a custom config or a preset."
      );
    }
  }
}
