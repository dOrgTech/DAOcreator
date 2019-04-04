import { TypeValidation } from "./integrations/web3"
import * as R from "ramda"

export function checkIfHasError<ValueType>(
  predicate: (value: ValueType) => boolean,
  errorMessage: string
) {
  return (value: ValueType) => (predicate(value) ? errorMessage : "")
}

const nameHasError = (name: string) =>
  R.isEmpty(name) || name.length > 70 || /[_\W\d]/.test(name)

const addressHasError = (addr: string) =>
  R.isEmpty(addr) || !TypeValidation.isAddress(addr)

const numberHasError = (number: string) =>
  R.isEmpty(number) || !TypeValidation.isBigNumber(number)

export const isValidName = checkIfHasError(
  nameHasError,
  "Error: Name must be less than 70 characters with no numbers or special characters"
)

export const isRequired = checkIfHasError(R.isEmpty, "This field is required")
export const isValidAddress = checkIfHasError(
  addressHasError,
  "Please enter a valid address."
)
export const isBigNumber = checkIfHasError(
  numberHasError,
  "Please enter a valid number."
)
