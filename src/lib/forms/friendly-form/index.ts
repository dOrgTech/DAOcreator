import { FormState, ValidatableMapOrArray } from "formstate";

export abstract class FriendlyForm<
  StateType,
  T extends ValidatableMapOrArray
> extends FormState<T> {
  public abstract toState(): StateType;
  public abstract fromState(state: StateType): void;

  private _description: string = "";
  private _displayName: string = "";

  setDescription(description: string): FriendlyForm<StateType, T> {
    this._description = description;
    return this;
  }

  get description(): string {
    return this._description;
  }

  setDisplayName(displayName: string): FriendlyForm<StateType, T> {
    this._displayName = displayName;
    return this;
  }

  get displayName(): string {
    return this._displayName;
  }
}
