import { FieldState } from "formstate";
import {
  StringField,
  TokenField,
  DateTimeField,
  DurationField,
  AddressField,
  PercentageField
} from "lib/forms";

export enum FieldType {
  String,
  Token,
  DateTime,
  Duration,
  Address,
  Percentage
}

export type AnyField =
  | StringField
  | TokenField
  | DateTimeField
  | DurationField
  | AddressField
  | PercentageField;

export abstract class Field<
  ValueType,
  DerivedType extends Field<ValueType, DerivedType>
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
