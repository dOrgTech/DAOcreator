import { VotingMachine } from "./index";
import { Address } from "lib/dependency/web3";

export enum SchemeType {
  ContributionReward,
  SchemeRegistrar,
  GenericScheme
}

export interface Scheme {
  type: SchemeType;
  permissions: string;
  votingMachine: VotingMachine;
}

export class ContributionReward implements Scheme {
  type = SchemeType.ContributionReward;
  permissions: string = "0x00000000";
  votingMachine: VotingMachine;

  constructor(votingMachine: VotingMachine) {
    this.votingMachine = votingMachine;
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
}

export class GenericScheme implements Scheme {
  type = SchemeType.GenericScheme;
  permissions: string = "0x00000010";
  votingMachine: VotingMachine;

  constructor(public contractToCall: Address, votingMachine: VotingMachine) {
    this.votingMachine = votingMachine;
  }
}
