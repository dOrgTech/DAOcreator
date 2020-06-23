import { Member, GenesisProtocolConfig } from "./index";
import { Address } from "../../../dependency/web3";

export interface DAOMigrationParams {
  orgName: string;
  tokenName: string;
  tokenSymbol: string;
  VotingMachinesParams: GenesisProtocolConfig[];
  Schemes: {
    name: string;
    permissions: string;
    params: any[];
    [args: string]: any;
  }[];
  StandAloneContracts: {
    name: string;
    fromArc: boolean;
    params?: any[];
    runFunctions: {
      functionName: string;
      params: any[];
    }[];
  }[];
  founders: Member[];
}

export interface DAOMigrationResult {
  arcVersion: string;
  name: string;
  Avatar: Address;
  DAOToken: Address;
  Reputation: Address;
  Controller: Address;
  Schemes: {
    name: string;
    alias: string;
    address: Address;
  }[];
  StandAloneContracts: {
    name: string;
    address: Address;
    arcVersion?: string;
  }[];
}

export interface DAOMigrationCallbacks {
  userApproval: (msg: string) => Promise<boolean>;
  info: (msg: string) => void;
  error: (msg: string) => void;
  txComplete: (msg: string, txHash: string, txCost: number) => Promise<void>;
  migrationAborted: (err: Error) => void;
  migrationComplete: (result: DAOMigrationResult) => void;
  getState: (network: string) => any;
  setState: (state: any, network: string) => void;
  cleanState: (network: string) => void;
}

export const toJSON = (params: DAOMigrationParams): string => {
  return JSON.stringify(params, null, 2);
};

export const fromJSON = (params: string): DAOMigrationParams => {
  return JSON.parse(params);
};
