import { Field, FieldType } from "lib/forms";

export class StringField extends Field<string, StringField> {
  constructor(init: string) {
    super(init, FieldType.String);
  }
}
