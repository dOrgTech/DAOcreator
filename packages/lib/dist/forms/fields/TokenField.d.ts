import { Field } from "../../forms";
export declare class TokenField extends Field<string, TokenField> {
  private _symbol;
  constructor(symbol: string | (() => string), init: string);
  readonly symbol: string;
}
