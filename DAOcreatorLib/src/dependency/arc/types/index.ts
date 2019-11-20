import { Address } from "../../../dependency/web3";

export * from "./schemes";
export * from "./votingMachines";
export * from "./migration";

export interface DAOConfig {
  daoName: string;
  tokenName: string;
  tokenSymbol: string;
}

export interface Member {
  address: Address;
  reputation: number;
  tokens: number | undefined;
}
