import { TypeValidation } from "./integrations/web3"
import * as R from "ramda"

export function checkForError<ValueType>(
  predicate: (value: ValueType) => boolean,
  errorMessage: string,
  value: ValueType
) {
  if (predicate(value)) {
    return { hasError: true, errorMessage }
  } else {
    return { hasError: false, errorMessage: "" }
  }
}

export const addressHasError = (addr: string) =>
  R.isEmpty(addr) || !TypeValidation.isAddress(addr)

export const numberHasError = (number: string) =>
  R.isEmpty(number) || !TypeValidation.isBigNumber(number)
