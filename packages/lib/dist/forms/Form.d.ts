import { FormState, ValidatableMapOrArray } from "formstate";
export declare abstract class Form<
  StateType,
  T extends ValidatableMapOrArray
> extends FormState<T> {
  abstract toState(): StateType;
  abstract fromState(state: StateType): void;
  private _description;
  private _displayName;
  setDescription(description: string): Form<StateType, T>;
  readonly description: string;
  setDisplayName(displayName: string): Form<StateType, T>;
  readonly displayName: string;
  setValues(
    values: {
      [key in keyof T]?: any;
    }
  ): Form<StateType, T>;
  readonly values: {
    [key in keyof T]: any;
  };
}
