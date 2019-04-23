import { TypeValidation } from "./integrations/web3"
import * as R from "ramda"
import { ParamConfig, ParamDefinition } from "./integrations/daoStack/arc"

export function checkIfHasError<ValueType>(
  predicate: (value: ValueType) => boolean,
  errorMessage: string
) {
  return (value: ValueType) => (predicate(value) ? errorMessage : "")
}

const nameHasError = (name: any) =>
  R.isEmpty(name) || name.length > 70 || /[_\W\d]/.test(name)

const addressHasError = (addr: any) =>
  R.isEmpty(addr) || !TypeValidation.isAddress(addr)

const numberHasError = (number: any) =>
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

export const generateFormErrors = (
  paramTypes: ParamDefinition[],
  paramValues: ParamConfig
) => {
  let formErrors = {}
  const formErrorObject = R.reduce(
    (acc, paramType) => {
      const value = paramValues[paramType.typeName]
      let errorMessage = ""
      if (value == null && !paramType.optional) {
        errorMessage = "Required"
      }
      return { ...acc, [paramType.typeName]: errorMessage }
    },
    formErrors,
    paramTypes
  )

  return formErrors
}
