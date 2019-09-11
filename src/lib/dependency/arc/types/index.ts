import { Address } from "lib/dependency/web3";
import BN from "bn.js";

export * from "./schemes";
export * from "./votingMachines";
export * from "./migration";

// TODO refactor this
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

export interface DeploymentInfo {
  avatar: Address;
  daoToken: Address;
  reputation: Address;
}

export interface ParamLink {
  getParameters: () => any[];
  getParametersHash: () => string;
}
