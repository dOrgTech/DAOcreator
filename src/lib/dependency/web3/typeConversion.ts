import * as Web3Utils from "web3-utils";
import * as EthJsUnits from "ethjs-unit";
import BN from "bn.js";

export const toBN = Web3Utils.toBN;
export const fromWei = (wei: BN): string => EthJsUnits.fromWei(wei, "ether");
export const toWei = (eth: BN): string => EthJsUnits.toWei(eth, "ether");
