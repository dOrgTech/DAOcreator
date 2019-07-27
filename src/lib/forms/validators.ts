import { Validator } from "formstate";
import { TypeValidation } from "../dependency/web3";
import { toBN } from "web3-utils";

type StringOrNull = string | null | undefined;

export const requiredText: Validator<StringOrNull> = value => {
  const error = "This is required.";

  if (value == null || value.trim().length === 0) {
    return error;
  }

  return null;
};

export const validAddress: Validator<string> = value => {
  const error = "Please enter a valid address.";
  value = value.trim();

  if (!TypeValidation.isAddress(value)) {
    return error;
  }

  return null;
};

export const validTokenSymbol: Validator<string> = value => {
  const error =
    "Token names must be all capitol letters and less than 4 characters.";
  value = value.trim();

  if (value.length > 4 || !/^[A-Z]+$/.test(value)) {
    return error;
  }

  return null;
};

export const validBigNumber: Validator<string> = value => {
  const error = "Please enter a valid number.";
  value = value.trim();

  if (!TypeValidation.isBigNumber(value)) {
    return error;
  }

  return null;
};

export const validName: Validator<string> = value => {
  const error = "Names must be less than 70 characters.";
  value = value.trim();

  if (value.length > 70) {
    return error;
  }

  return null;
};

export const validPercentage: Validator<string> = value => {
  const error = "Percentages must be between 0 and 100.";
  value = value.trim();
  const number = Number(value);

  if (number > 100 || number < 0) {
    return error;
  }

  return null;
};

export const greaterThan = (bound: number) => (value: string) => {
  const error = `Number must be greater than ${bound}.`;
  value = value.trim();

  if (toBN(value).toNumber() > bound) {
    return null;
  }

  return error;
};

export const greaterThanOrEqual = (bound: number) => (value: string) => {
  const error = `Number must be greater than or equal to ${bound}.`;
  value = value.trim();

  if (toBN(value).toNumber() >= bound) {
    return null;
  }

  return error;
};

export const lessThanOrEqual = (bound: number) => (value: string) => {
  const error = `Number must be less than or equal to ${bound}.`;
  value = value.trim();

  if (toBN(value).toNumber() <= bound) {
    return null;
  }

  return error;
};

export const nonZeroAddress: Validator<string> = value => {
  const error = "Address must not be zero.";
  value = value.trim();

  if (value === "0x0000000000000000000000000000000000000000") {
    return error;
  }

  return null;
};

export const requireElement = (elementName: string) => (array: any[]) =>
  !array.length && `Please add a ${elementName}.`;

export const noDuplicates = (evaluate: (a: any, b: any) => boolean) => (
  array: any[]
) => {
  for (let i = 0; i < array.length; ++i) {
    const a = array[i];

    for (let k = 0; k < array.length; ++k) {
      if (k === i) continue;
      const b = array[k];

      if (evaluate(a, b)) {
        return "This is a duplicate entry.";
      }
    }
  }
};
