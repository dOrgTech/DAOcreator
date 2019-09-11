import { ParamLink, VotingMachine } from "./index";
import { Address, keccak256, encodeParameters } from "lib/dependency/web3";

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
