import { Field, FieldType, validNumber } from "../../forms";

export class NumberField extends Field<string, NumberField> {
  constructor(init: string) {
    super(init, FieldType.Number);
    this.validators(validNumber);
  }
}
