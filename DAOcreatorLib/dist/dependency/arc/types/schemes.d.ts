import { VotingMachine } from "./index";
import { Address } from "../../../dependency/web3";
export declare enum SchemeType {
  ContributionReward = 0,
  SchemeRegistrar = 1,
  GenericScheme = 2
}
export interface Scheme {
  type: SchemeType;
  permissions: string;
  votingMachine: VotingMachine;
}
export declare class ContributionReward implements Scheme {
  type: SchemeType;
  permissions: string;
  votingMachine: VotingMachine;
  constructor(votingMachine: VotingMachine);
}
export declare class SchemeRegistrar implements Scheme {
  type: SchemeType;
  permissions: string;
  votingMachine: VotingMachine;
  constructor(votingMachine: VotingMachine);
}
export declare class GenericScheme implements Scheme {
  contractToCall: Address;
  type: SchemeType;
  permissions: string;
  votingMachine: VotingMachine;
  constructor(contractToCall: Address, votingMachine: VotingMachine);
}
