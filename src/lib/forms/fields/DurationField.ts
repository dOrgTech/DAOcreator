import { Field, FieldType, validDuration, positiveDuration } from "lib/forms";

// TODO: enforce formatting
// Format: DD:hh:mm:ss
export class DurationField extends Field<string, DurationField> {
  get days(): number {
    const parts = this.value.split(":");
    return Number(parts[0]);
  }

  get hours(): number {
    const parts = this.value.split(":");
    return Number(parts[1]);
  }

  get minutes(): number {
    const parts = this.value.split(":");
    return Number(parts[2]);
  }

  get seconds(): number {
    const parts = this.value.split(":");
    return Number(parts[3]);
  }

  constructor(init: string) {
    super(init, FieldType.Duration);
    this.validators(validDuration, positiveDuration);
  }

  // TODO: put these constants somewhere (86400, 3600, etc)
  public toSeconds(): number {
    const parts = this.value.split(":");
    const days = Number(parts[0]);
    const hours = Number(parts[1]);
    const minutes = Number(parts[2]);
    const seconds = Number(parts[3]);

    return days * 86400 + hours * 3600 + minutes * 60 + seconds;
  }

  public fromSeconds(seconds: number): void {
    const days = Math.trunc(seconds / 86400);
    seconds -= days * 86400;
    const hours = Math.trunc(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.trunc(seconds / 60);
    seconds -= minutes * 60;
    seconds = Math.trunc(seconds);
    this.value = `${days}:${hours}:${minutes}:${seconds}`;
  }
}
