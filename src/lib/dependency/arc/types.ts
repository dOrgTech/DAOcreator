import { Address, BN, keccak256, encodeParameters } from "../web3";

export interface DAO {
  avatar: Address;
  daoToken: Address;
  reputation: Address;
  config: DAOConfig;
}

export interface DAOConfig {
  daoName: string;
  tokenName: string;
  tokenSymbol: string;
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

export interface Scheme extends ParamLink {
  typeName: string;
  permissions: string;
  votingMachine: VotingMachine;
}

export interface VotingMachine extends ParamLink {
  typeName: string;
  address: Address;
}

export class GenesisProtocol implements VotingMachine {
  public typeName: string = "GenesisProtocol";
  public address: Address = "TODO";

  constructor(
    public queuedVoteRequiredPercentage: BN,
    public queuedVotePeriodLimit: BN,
    public thresholdConst: BN,
    public proposingRepReward: BN,
    public minimumDaoBounty: BN,
    public boostedVotePeriodLimit: BN,
    public daoBountyConst: BN,
    public activationTime: BN,
    public preBoostedVotePeriodLimit: BN,
    public quietEndingPeriod: BN,
    public voteOnBehalf: Address,
    public votersReputationLossRatio: BN
  ) {}

  public getParameters(): any[] {
    return [
      [
        this.queuedVoteRequiredPercentage,
        this.queuedVotePeriodLimit,
        this.boostedVotePeriodLimit,
        this.preBoostedVotePeriodLimit,
        this.thresholdConst,
        this.quietEndingPeriod,
        this.proposingRepReward,
        this.votersReputationLossRatio,
        this.minimumDaoBounty,
        this.daoBountyConst,
        this.activationTime
      ],
      this.voteOnBehalf
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
              this.queuedVoteRequiredPercentage,
              this.queuedVotePeriodLimit,
              this.boostedVotePeriodLimit,
              this.preBoostedVotePeriodLimit,
              this.thresholdConst,
              this.quietEndingPeriod,
              this.proposingRepReward,
              this.votersReputationLossRatio,
              this.minimumDaoBounty,
              this.daoBountyConst,
              this.activationTime
            ]
          ),
          this.voteOnBehalf
        ]
      )
    );
  }
}

export class GenericScheme implements Scheme {
  typeName: string = "GenericScheme";
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

export class ContributionReward implements Scheme {
  typeName: string = "ContributionReward";
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
  typeName: string = "SchemeRegistrar";
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

export interface DeploymentInfo {
  avatar: Address;
  daoToken: Address;
  reputation: Address;
  votingMachineParametersKey?: string; // hash
  votingMachineAddress?: Address;
}
