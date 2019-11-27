import * as Web3Utils from "web3-utils";
import { Address } from "./types";

export const isAddress = (address: Address): boolean => {
  const addr = address.toLowerCase();
  return addr[0] === "0" && addr[1] === "x" && Web3Utils.isAddress(addr);
};

export const isBN = (number: Object): boolean => {
  return Web3Utils.isBN(number);
};
