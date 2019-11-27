import { ValidatableMapOrArray } from "formstate";
import { Form } from "../../forms/Form";
import {
  AnyField,
  GenericSchemeForm,
  ContributionRewardForm,
  SchemeRegistrarForm,
  GenesisProtocolForm
} from "../../forms";
import { SchemeType } from "../../state";
import { Scheme } from "../../dependency/arc";
export declare type AnySchemeForm =
  | GenericSchemeForm
  | ContributionRewardForm
  | SchemeRegistrarForm;
export declare abstract class SchemeForm<
  StateType extends Scheme,
  T extends ValidatableMapOrArray & {
    votingMachine: GenesisProtocolForm;
  }
> extends Form<StateType, T> {
  abstract getParams(): AnyField[];
  private _type;
  readonly type: SchemeType;
  constructor(type: SchemeType, $: T);
}
export declare class SchemesForm extends Form<Scheme[], AnySchemeForm[]> {
  constructor(form?: SchemesForm);
  toState(): Scheme[];
  fromState(state: Scheme[]): void;
}
