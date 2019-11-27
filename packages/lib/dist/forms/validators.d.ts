import { Validator } from "formstate";
declare type StringOrNull = string | null | undefined;
export declare const requiredText: Validator<StringOrNull>;
export declare const validAddress: Validator<string>;
export declare const validTokenSymbol: Validator<string>;
export declare const validBigNumber: Validator<string>;
export declare const validNumber: Validator<string>;
export declare const validName: Validator<string>;
export declare const validPercentage: Validator<number>;
export declare const validDuration: Validator<string>;
export declare const positiveDuration: Validator<string>;
export declare const futureDate: Validator<Date | undefined>;
export declare const greaterThan: (
  bound: number
) => (value: string) => string | null;
export declare const greaterThanOrEqual: (
  bound: number
) => (value: string) => string | null;
export declare const lessThanOrEqual: (
  bound: number
) => (value: string) => string | null;
export declare const nonZeroAddress: Validator<string>;
export declare const requireElement: (
  elementName: string
) => (array: any[]) => string | false;
export declare const noDuplicates: (
  evaluate: (a: any, b: any) => boolean,
  toString: (value: any) => string
) => (array: any[]) => string | undefined;
export {};
