import { Address, TypeConversion } from "lib/dependency/web3";
import BN from "bn.js";
const { toBN } = TypeConversion;

export interface VotingMachine {
  typeName: string;
}

export interface GenesisProtocolConfig {
  queuedVoteRequiredPercentage: BN;
  queuedVotePeriodLimit: BN;
  thresholdConst: BN;
  proposingRepReward: BN;
  minimumDaoBounty: BN;
  boostedVotePeriodLimit: BN;
  daoBountyConst: BN;
  activationTime: BN;
  preBoostedVotePeriodLimit: BN;
  quietEndingPeriod: BN;
  voteOnBehalf: Address;
  votersReputationLossRatio: BN;
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
      boostedVotePeriodLimit: toBN(129600), // 1.5 days
      daoBountyConst: toBN(10),
      minimumDaoBounty: toBN(50), // 50 GEN
      queuedVotePeriodLimit: toBN(604800), // 7 days
      queuedVoteRequiredPercentage: toBN(50), // 50%
      preBoostedVotePeriodLimit: toBN(43200), // 12 hours
      proposingRepReward: toBN(10), // 10 REP
      quietEndingPeriod: toBN(86400), // 1 day
      thresholdConst: toBN(1200),
      votersReputationLossRatio: toBN(1), // 1%
      voteOnBehalf: "0x0000000000000000000000000000000000000000",
      activationTime: toBN(0)
    };
  }

  public static get NormalConfig(): GenesisProtocolConfig {
    return {
      boostedVotePeriodLimit: toBN(345600), // 4 days
      daoBountyConst: toBN(10),
      minimumDaoBounty: toBN(150), // 150 GEN
      queuedVotePeriodLimit: toBN(2592000), // 30 days
      queuedVoteRequiredPercentage: toBN(50), // 50%
      preBoostedVotePeriodLimit: toBN(86400), // 1 day
      proposingRepReward: toBN(50), // 50 REP
      quietEndingPeriod: toBN(172800), // 2 day
      thresholdConst: toBN(1200),
      votersReputationLossRatio: toBN(4), // 4%
      voteOnBehalf: "0x0000000000000000000000000000000000000000",
      activationTime: toBN(0)
    };
  }

  public static get CriticalConfig(): GenesisProtocolConfig {
    return {
      boostedVotePeriodLimit: toBN(691200), // 8 days
      daoBountyConst: toBN(10),
      minimumDaoBounty: toBN(500), // 500 GEN
      queuedVotePeriodLimit: toBN(5184000), // 60 days
      queuedVoteRequiredPercentage: toBN(50), // 50%
      preBoostedVotePeriodLimit: toBN(172800), // 2 day
      proposingRepReward: toBN(200), // 200 REP
      quietEndingPeriod: toBN(345600), // 4 day
      thresholdConst: toBN(1500),
      votersReputationLossRatio: toBN(4), // 4%
      voteOnBehalf: "0x0000000000000000000000000000000000000000",
      activationTime: toBN(0)
    };
  }

  constructor(opts: GenesisProtocolOpts) {
    if (opts.preset) {
      if (typeof opts.preset === "string") {
        opts.preset = Number(opts.preset);
      }

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
