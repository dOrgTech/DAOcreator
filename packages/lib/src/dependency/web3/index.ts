import BN from "bn.js";
import Web3 from "web3";
import * as typeValidation from "./typeValidation";
import * as typeConversion from "./typeConversion";

export * from "./types";
export const TypeValidation = typeValidation;
export const TypeConversion = typeConversion;

export type ProviderOrGetter = any | (() => Promise<any>);
let web3Provider: ProviderOrGetter;

export const setWeb3Provider = (providerOrGetter: ProviderOrGetter) => {
  web3Provider = providerOrGetter;
};

export const getWeb3 = async (): Promise<any> => {
  let readyWeb3;

  // Default behaviour is to look for an injected
  // web3 instance in the window
  const ethereum = (window as any).ethereum;
  const web3 = (window as any).web3;

  // Ignore the window injection if a specific getter has
  // been set.
  if (web3Provider) {
    let provider = web3Provider;
    if (typeof provider === "function") {
      provider = await provider();
    }
    readyWeb3 = new Web3(provider);
  } else if (ethereum) {
    try {
      // Request account access if needed
      await ethereum.enable();

      // Acccounts now exposed
      readyWeb3 = new Web3(ethereum);
    } catch (error) {
      return Promise.reject("User denied account access...");
    }
  }
  // Legacy dapp browsers...
  else if (web3) {
    readyWeb3 = new Web3(web3.currentProvider);
  }
  // Non-dapp browsers...
  else {
    return Promise.reject(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }

  const accounts = await readyWeb3.eth.getAccounts();
  readyWeb3.eth.defaultAccount = accounts[0];

  return readyWeb3;
};

export const getDefaultOpts = async (): Promise<any> => {
  const web3 = await getWeb3();
  const block = await web3.eth.getBlock("latest");
  return {
    from: web3.eth.defaultAccount,
    gas: block.gasLimit - 100000,
    gasPrice: web3.utils.toWei("7", "gwei")
  };
};

export const getNetworkName = async (): Promise<string> => {
  const web3 = await getWeb3();
  let network = await web3.eth.net.getNetworkType();

  if (network === "main") {
    network = "mainnet";
  }

  return network;
};

export const keccak256 = (value: string | BN): string => {
  const web3 = new Web3();

  if (typeof value === "string") {
    return web3.utils.keccak256(value);
  } else {
    return web3.utils.keccak256(value.toString());
  }
};

export const encodeParameters = (
  types: string[],
  parameters: any[]
): string => {
  const web3 = new Web3();
  return web3.eth.abi.encodeParameters(types, parameters);
};
