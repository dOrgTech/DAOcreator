import BN from "bn.js";
import Web3 from "web3";
import * as typeValidation from "./typeValidation";
import * as typeConversion from "./typeConversion";

export * from "./types";
export const TypeValidation = typeValidation;
export const TypeConversion = typeConversion;

let readyWeb3: Web3;

export const getWeb3 = async (): Promise<any> => {
  if (readyWeb3 != null) {
    const accounts = await readyWeb3.eth.getAccounts();
    readyWeb3.eth.defaultAccount = accounts[0];
    return readyWeb3;
  }
  const ethereum = (window as any).ethereum;
  const web3 = (window as any).web3;

  if (ethereum) {
    try {
      // Request account access if needed
      await ethereum.enable();

      // Acccounts now exposed
      readyWeb3 = new Web3(ethereum);
      const accounts = await readyWeb3.eth.getAccounts();
      readyWeb3.eth.defaultAccount = accounts[0];
    } catch (error) {
      return Promise.reject("User denied account access...");
    }
  }
  // Legacy dapp browsers...
  else if (web3) {
    readyWeb3 = new Web3(web3.currentProvider);
    const accounts = await readyWeb3.eth.getAccounts();
    readyWeb3.eth.defaultAccount = accounts[0];
  }
  // Non-dapp browsers...
  else {
    return Promise.reject(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }

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
  if (readyWeb3 == null) {
    throw Error("Web3 not initialized. Please call 'getWeb3'");
  }

  if (typeof value === "string") {
    return readyWeb3.utils.keccak256(value);
  } else {
    return readyWeb3.utils.keccak256(value.toString());
  }
};

export const encodeParameters = (
  types: string[],
  parameters: any[]
): string => {
  if (readyWeb3 == null) {
    throw Error("Web3 not initialized. Please call 'getWeb3'");
  }

  return readyWeb3.eth.abi.encodeParameters(types, parameters);
};
