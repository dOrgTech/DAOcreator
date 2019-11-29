import { Field, FieldType } from "../../forms";

export class DateTimeField extends Field<Date | undefined, DateTimeField> {
  constructor(init?: Date) {
    super(init, FieldType.DateTime);
  }

  public getunixTime(): number {
    if (this.value === undefined) {
      return 0;
    }

    // div by 1000 to convert to seconds
    return this.value.getTime() / 1000;
  }

  public fromUnixTime(unix: number): void {
    if (unix === 0) {
      // now
      this.value = undefined;
    } else {
      // mul by 1000 to convert to milliseconds
      this.value = new Date(unix * 1000);
    }
  }
}
