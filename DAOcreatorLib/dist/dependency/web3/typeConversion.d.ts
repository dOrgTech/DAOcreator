/// <reference types="node" />
import BN from "bn.js";
export declare const toBN: (
  number: string | number | BN | Uint8Array | Buffer | number[],
  base?: number | "hex" | undefined,
  endian?: "le" | "be" | undefined
) => BN;
export declare const fromWei: (wei: BN) => string;
export declare const toWei: (eth: BN) => string;
