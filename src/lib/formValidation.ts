import * as R from "ramda"
import { ParamConfig, ParamDefinition } from "./integrations/daoStack/arc"
import { TypeValidation } from "./integrations/web3"

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

export const isRequired = checkIfHasError(
  R.either(R.isEmpty, R.isNil),
  "This field is required"
)
export const isValidAddress = checkIfHasError(
  addressHasError,
  "Please enter a valid address."
)
export const isBigNumber = checkIfHasError(
  numberHasError,
  "Please enter a valid number."
)

export const generateFormErrors = (
  paramDefinitions: ParamDefinition[],
  paramValues: ParamConfig,
  formErrors: any
) =>
  R.reduce(
    (acc, paramDefinition) => {
      const value = paramValues[paramDefinition.typeName]
      const isRequired = !paramDefinition.optional
      if (R.either(R.isEmpty, R.isNil)(value)) {
        return {
          ...acc,
          [paramDefinition.typeName]: isRequired ? "Required" : "",
        }
      } else {
        let errorMessage = ""
        switch (paramDefinition.valueType) {
          case "Address":
            errorMessage = isValidAddress(value)
            break
          case "BigNumber":
            errorMessage = isBigNumber(value)
            break
          case "number":
            errorMessage = isBigNumber(value)
            break
          default: {
          }
        }

        return {
          ...acc,
          [paramDefinition.typeName]: errorMessage,
        }
      }
    },
    formErrors,
    paramDefinitions
  )
