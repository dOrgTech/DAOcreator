import { FieldState } from "formstate";
import {
  StringField,
  TokenField,
  DateTimeField,
  DurationField,
  AddressField,
  PercentageField
} from "../forms";
export declare enum FieldType {
  String = 0,
  Token = 1,
  DateTime = 2,
  Duration = 3,
  Address = 4,
  Percentage = 5
}
export declare type AnyField =
  | StringField
  | TokenField
  | DateTimeField
  | DurationField
  | AddressField
  | PercentageField;
export declare abstract class Field<
  ValueType,
  DerivedType extends Field<ValueType, DerivedType>
> extends FieldState<ValueType> {
  private _description;
  private _displayName;
  private _story;
  private _type;
  constructor(init: ValueType, type: FieldType);
  setDescription(description: string): DerivedType;
  readonly description: string;
  setDisplayName(displayName: string): DerivedType;
  readonly displayName: string;
  setStory(story: string): DerivedType;
  readonly story: string;
  readonly type: FieldType;
}
