import * as Web3Utils from "web3-utils";
import { Address } from "./types";

export const isAddress = (address: Address): boolean => {
  return Web3Utils.isAddress(address);
};

export const isBigNumber = (number: string | number): boolean => {
  try {
    Web3Utils.toBN(number);
    return true;
  } catch {
    return false;
  }
};
