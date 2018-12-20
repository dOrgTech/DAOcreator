export function validate<ValueType>(
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
