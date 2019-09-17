import {
  Address,
  keccak256,
  encodeParameters,
  TypeConversion
} from "lib/dependency/web3";
import BN from "bn.js";
import { StringField } from "lib/forms";
const { toBN } = TypeConversion;

// TODO refactor this
export interface DAO {
  avatar: Address;
  daoToken: Address;
  reputation: Address;
  config: DAOConfig;
}

export interface DAOConfig {
  expertConfig?: ExpertDAOConfig;
  simpleConfig?: SimpleDAOConfig;
}

export interface ExpertDAOConfig {
  daoName: StringField;
  tokenName: StringField;
  tokenSymbol: StringField;
}

export interface SimpleDAOConfig {
  daoName: StringField;
  daoSymbol: StringField;
}

export interface Member {
  address: Address;
  reputation: BN;
  tokens: BN;
}

export interface ParamLink {
  getParameters: () => any[];
  getParametersHash: () => string;
}

export enum SchemeType {
  ContributionReward,
  SchemeRegistrar,
  GenericScheme
}

export interface Scheme extends ParamLink {
  type: SchemeType;
  permissions: string;
  votingMachine: VotingMachine;
}

export interface VotingMachine extends ParamLink {
  typeName: string;
  address: Address;
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
  public address: Address = "TODO";
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

  public getParameters(): any[] {
    return [
      [
        this.config.queuedVoteRequiredPercentage,
        this.config.queuedVotePeriodLimit,
        this.config.boostedVotePeriodLimit,
        this.config.preBoostedVotePeriodLimit,
        this.config.thresholdConst,
        this.config.quietEndingPeriod,
        this.config.proposingRepReward,
        this.config.votersReputationLossRatio,
        this.config.minimumDaoBounty,
        this.config.daoBountyConst,
        this.config.activationTime
      ],
      this.config.voteOnBehalf
    ];
  }

  public getParametersHash(): string {
    return keccak256(
      encodeParameters(
        ["bytes32", "address"],
        [
          encodeParameters(
            [
              "uint",
              "uint",
              "uint",
              "uint",
              "uint",
              "uint",
              "uint",
              "uint",
              "uint",
              "uint",
              "uint"
            ],
            [
              this.config.queuedVoteRequiredPercentage,
              this.config.queuedVotePeriodLimit,
              this.config.boostedVotePeriodLimit,
              this.config.preBoostedVotePeriodLimit,
              this.config.thresholdConst,
              this.config.quietEndingPeriod,
              this.config.proposingRepReward,
              this.config.votersReputationLossRatio,
              this.config.minimumDaoBounty,
              this.config.daoBountyConst,
              this.config.activationTime
            ]
          ),
          this.config.voteOnBehalf
        ]
      )
    );
  }
}

export class ContributionReward implements Scheme {
  type = SchemeType.ContributionReward;
  permissions: string = "0x00000000";
  votingMachine: VotingMachine;

  constructor(votingMachine: VotingMachine) {
    this.votingMachine = votingMachine;
  }

  public getParameters(): any[] {
    return [this.votingMachine.getParametersHash(), this.votingMachine.address];
  }

  public getParametersHash(): string {
    return keccak256(
      encodeParameters(["bytes32", "address"], this.getParameters())
    );
  }
}

// TODO: support multiple voting machine configurations
export class SchemeRegistrar implements Scheme {
  type = SchemeType.SchemeRegistrar;
  permissions: string = "0x0000001F";
  votingMachine: VotingMachine;

  constructor(votingMachine: VotingMachine) {
    this.votingMachine = votingMachine;
  }

  public getParameters(): any[] {
    return [
      this.votingMachine.getParametersHash(),
      this.votingMachine.getParametersHash(),
      this.votingMachine.address
    ];
  }

  public getParametersHash(): string {
    return keccak256(
      encodeParameters(["bytes32", "bytes32", "address"], this.getParameters())
    );
  }
}

export class GenericScheme implements Scheme {
  type = SchemeType.GenericScheme;
  permissions: string = "0x00000010";
  votingMachine: VotingMachine;

  constructor(public contractToCall: Address, votingMachine: VotingMachine) {
    this.votingMachine = votingMachine;
  }

  public getParameters(): any[] {
    return [
      this.votingMachine.getParametersHash(),
      this.votingMachine.address,
      this.contractToCall
    ];
  }

  public getParametersHash(): string {
    return keccak256(
      encodeParameters(["bytes32", "address", "address"], this.getParameters())
    );
  }
}

export interface DeploymentInfo {
  avatar: Address;
  daoToken: Address;
  reputation: Address;
  votingMachineParametersKey?: string; // hash
  votingMachineAddress?: Address;
}
