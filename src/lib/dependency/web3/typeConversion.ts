import * as EthJsUnits from "ethjs-unit";
import BN from "bn.js";

type Endianness = "le" | "be";
export const toBN = (
  number: number | string | number[] | Uint8Array | Buffer | BN,
  base?: number | "hex",
  endian?: Endianness
) => new BN(number, base, endian);

export const fromWei = (wei: BN): string => EthJsUnits.fromWei(wei, "ether");
export const toWei = (eth: BN): string => EthJsUnits.toWei(eth, "ether");
