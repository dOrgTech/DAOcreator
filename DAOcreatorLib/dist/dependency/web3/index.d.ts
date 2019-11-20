import BN from "bn.js";
import * as typeValidation from "./typeValidation";
import * as typeConversion from "./typeConversion";
export * from "./types";
export declare const TypeValidation: typeof typeValidation;
export declare const TypeConversion: typeof typeConversion;
export declare const getWeb3: () => Promise<any>;
export declare const getDefaultOpts: () => Promise<any>;
export declare const getNetworkName: () => Promise<string>;
export declare const keccak256: (value: string | BN) => string;
export declare const encodeParameters: (
  types: string[],
  parameters: any[]
) => string;
