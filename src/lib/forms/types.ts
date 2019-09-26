import { FieldState, FormState, ValidatableMapOrArray } from "formstate";
import csvParse from "csv-parse";
import csvStringify from "csv-stringify";
import {
  requiredText,
  validAddress,
  validBigNumber,
  validTokenSymbol,
  validName,
  requireElement,
  noDuplicates,
  validPercentage,
  greaterThan,
  lessThanOrEqual,
  greaterThanOrEqual,
  nonZeroAddress,
  positiveDuration,
  validDuration,
  futureDate
} from "./validators";
import {
  DAOcreatorState,
  DAOConfig,
  Member,
  GenesisProtocol,
  Scheme,
  GenericScheme,
  ContributionReward,
  SchemeRegistrar
} from "lib/state";
import { TypeConversion } from "lib/dependency/web3";
import { SchemeType, GenesisProtocolPreset } from "lib/dependency/arc";
const { toBN } = TypeConversion;

export enum FieldType {
  String,
  Token,
  DateTime,
  Duration,
  Address,
  Percentage
}

export abstract class FriendlyField<
  ValueType,
  DerivedType extends FriendlyField<ValueType, DerivedType>
> extends FieldState<ValueType> {
  private _description: string = "";
  private _displayName: string = "";
  private _story: string = "";
  private _type: FieldType;

  constructor(init: ValueType, type: FieldType) {
    super(init);
    this._type = type;
  }

  setDescription(description: string): DerivedType {
    this._description = description;
    return (this as any) as DerivedType;
  }

  get description(): string {
    return this._description;
  }

  setDisplayName(displayName: string): DerivedType {
    this._displayName = displayName;
    return (this as any) as DerivedType;
  }

  get displayName(): string {
    return this._displayName;
  }

  setStory(story: string): DerivedType {
    this._story = story;
    return (this as any) as DerivedType;
  }

  get story(): string {
    return this._story;
  }

  get type(): FieldType {
    return this._type;
  }
}

export class StringField extends FriendlyField<string, StringField> {
  constructor(init: string) {
    super(init, FieldType.String);
  }
}

export class TokenField extends FriendlyField<string, TokenField> {
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

export class DateTimeField extends FriendlyField<
  Date | undefined,
  DateTimeField
> {
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

// TODO: enforce formatting
// Format: DD:hh:mm:ss
export class DurationField extends FriendlyField<string, DurationField> {
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

// TODO: add standard verifiers for known types
export class AddressField extends FriendlyField<string, AddressField> {
  constructor(init: string) {
    super(init, FieldType.Address);
  }
}

export class PercentageField extends FriendlyField<number, PercentageField> {
  constructor(init: number) {
    super(init, FieldType.Percentage);
    this.validators(validPercentage);
  }
}

export type AnyField =
  | StringField
  | TokenField
  | DateTimeField
  | DurationField
  | AddressField
  | PercentageField;

export abstract class FriendlyForm<
  T extends ValidatableMapOrArray
> extends FormState<T> {
  private _description: string = "";
  private _displayName: string = "";

  setDescription(description: string): FriendlyForm<T> {
    this._description = description;
    return this;
  }

  get description(): string {
    return this._description;
  }

  setDisplayName(displayName: string): FriendlyForm<T> {
    this._displayName = displayName;
    return this;
  }

  get displayName(): string {
    return this._displayName;
  }
}

export abstract class Form<
  StateType,
  T extends ValidatableMapOrArray
> extends FriendlyForm<T> {
  public abstract toState(): StateType;
  public abstract fromState(state: StateType): void;
}

export abstract class SimpleForm<
  FormType extends Form<any, any>,
  T extends ValidatableMapOrArray
> extends FriendlyForm<T> {
  public abstract toForm(): FormType;
  public abstract fromForm(form: FormType): void;
}
