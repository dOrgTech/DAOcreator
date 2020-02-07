import { Field, FieldType } from "../../forms";

// TODO: add standard verifiers for known types
export class AddressField extends Field<string, AddressField> {
  constructor(init: string) {
    super(init, FieldType.Address);
  }
}
