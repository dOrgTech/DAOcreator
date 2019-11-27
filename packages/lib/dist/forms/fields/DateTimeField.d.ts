import { Field } from "../../forms";
export declare class DateTimeField extends Field<
  Date | undefined,
  DateTimeField
> {
  constructor(init?: Date);
  getunixTime(): number;
  fromUnixTime(unix: number): void;
}
