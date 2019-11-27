import { Field } from "../../forms";
export declare class DurationField extends Field<string, DurationField> {
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  constructor(init: string);
  toSeconds(): number;
  fromSeconds(seconds: number): void;
}
