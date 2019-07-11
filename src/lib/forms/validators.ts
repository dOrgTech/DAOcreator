import { Validator } from "formstate"
import { TypeValidation } from "../integrations/web3"

type StringOrNull = string | null | undefined

export const requiredText: Validator<StringOrNull> = value => {
  const error = "This is required."

  if (value == null || value.trim().length === 0) {
    console.log("here")
    console.log(value)
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
  const error = "Please enter a valid token symbol."
  value = value.trim()

  if (value.length > 4 || !/[_\W\d]/.test(value)) {
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
  const error =
    "Name must be less than 70 characters with no numbers or spectial characters"
  value = value.trim()

  if (value.length > 70 || !/[_\W\d]/.test(value)) {
    return error
  }

  return null
}

export const requireElement = (elementName: string) => (value: any[]) =>
  !value.length && `Please add a ${elementName}.`
