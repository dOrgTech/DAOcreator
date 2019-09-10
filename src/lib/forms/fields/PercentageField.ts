import { Field, FieldType, validPercentage } from "lib/forms";

export class PercentageField extends Field<number, PercentageField> {
  constructor(init: number) {
    super(init, FieldType.Percentage);
    this.validators(validPercentage);
  }
}
