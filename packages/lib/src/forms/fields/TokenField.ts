import { Field, FieldType } from "../../forms";

export class TokenField extends Field<string, TokenField> {
  private _symbol: string | (() => string);

  constructor(symbol: string | (() => string), init: string) {
    super(init, FieldType.Token);
    this._symbol = symbol;
  }

  get symbol(): string {
    if (typeof this._symbol === "string") {
      return this._symbol as string;
    } else {
      return this._symbol();
    }
  }
}
