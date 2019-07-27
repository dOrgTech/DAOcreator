import { FieldState } from "formstate";

export const GetStringOrEmpty = (field: FieldState<string>): string =>
  field.hasBeenValidated && !field.hasError ? field.value : "";
