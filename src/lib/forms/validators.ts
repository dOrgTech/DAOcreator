import { Validator } from "formstate"
import { TypeValidation } from "../dependency/web3"

type StringOrNull = string | null | undefined

export const requiredText: Validator<StringOrNull> = value => {
  const error = "This is required."

  if (value == null || value.trim().length === 0) {
    return error
  }

  return null
}

export const validAddress: Validator<string> = value => {
  const error = "Please enter a valid address."
  value = value.trim()

  if (!TypeValidation.isAddress(value)) {
    return error
  }

  return null
}

export const validTokenSymbol: Validator<string> = value => {
  const error =
    "Token names must be all capitol letters and less than 4 characters."
  value = value.trim()

  if (value.length > 4 || !/^[A-Z]+$/.test(value)) {
    return error
  }

  return null
}

export const validBigNumber: Validator<string> = value => {
  const error = "Please enter a valid number."
  value = value.trim()

  if (!TypeValidation.isBigNumber(value)) {
    return error
  }

  return null
}

export const validName: Validator<string> = value => {
  const error = "Names must be less than 70 characters."
  value = value.trim()

  if (value.length > 70) {
    return error
  }

  return null
}

export const requireElement = (elementName: string) => (value: any[]) =>
  !value.length && `Please add a ${elementName}.`
