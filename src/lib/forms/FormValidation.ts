import * as R from "ramda"
import { ParamConfig, ParamDefinition } from "../integrations/arc"
import { TypeValidation } from "../integrations/web3"

function checkIfHasError<ValueType>(
  predicate: (value: ValueType) => boolean,
  errorMessage: string
) {
  return (value: ValueType) => (predicate(value) ? errorMessage : "")
}

const nameHasError = (name: string) =>
  !name || R.isEmpty(name) || name.length > 70 || /[_\W\d]/.test(name)

const addressHasError = (addr: string) =>
  !addr || R.isEmpty(addr) || !TypeValidation.isAddress(addr)

const bigNumberHasError = (number: string) =>
  !number || R.isEmpty(number) || !TypeValidation.isBigNumber(number)

const tokenSymbolHasError = (tokenSymbol: string) =>
  !tokenSymbol || R.isEmpty(tokenSymbol) || tokenSymbol.length > 4

export const isName = checkIfHasError(
  nameHasError,
  "Name must be less than 70 characters with no numbers or special characters"
)

export const isRequired = checkIfHasError(
  R.either(R.isEmpty, R.isNil),
  "This field is required."
)
export const isAddress = checkIfHasError(
  addressHasError,
  "Please enter a valid address."
)
export const isBigNumber = checkIfHasError(
  bigNumberHasError,
  "Please enter a valid number."
)

export const isTokenSymbol = checkIfHasError(
  tokenSymbolHasError,
  "Symbol should be max 4 characters for displays on exchanges."
)

// TODO: deprecate this, rename file to "DataValidators"
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
            errorMessage = isAddress(value as string)
            break
          case "BigNumber":
            errorMessage = isBigNumber(value as string)
            break
          case "number":
            errorMessage = isBigNumber(value.toString())
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
