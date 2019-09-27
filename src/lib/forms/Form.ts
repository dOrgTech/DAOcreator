import { FormState, ValidatableMapOrArray } from "formstate";

export abstract class Form<
  StateType,
  T extends ValidatableMapOrArray
> extends FormState<T> {
  public abstract toState(): StateType;
  public abstract fromState(state: StateType): void;

  private _description: string = "";
  private _displayName: string = "";

  setDescription(description: string): Form<StateType, T> {
    this._description = description;
    return this;
  }

  get description(): string {
    return this._description;
  }

  setDisplayName(displayName: string): Form<StateType, T> {
    this._displayName = displayName;
    return this;
  }

  get displayName(): string {
    return this._displayName;
  }

  setValues(values: { [key in keyof T]?: any }): Form<StateType, T> {
    // iterate through all the possible keys
    for (let [key, value] of Object.entries(values)) {
      const field = (this.$ as any)[key];
      // if it's a FieldState, it has the property "value"
      if ((field as Object).hasOwnProperty("value")) {
        field.value = value;
      } else {
        (this.$ as any)[key] = value;
      }
    }
    return this;
  }

  get values(): { [key in keyof T]: any } {
    let values: any = {};

    for (let [key, value] of Object.entries(this.$)) {
      if ((value as Object).hasOwnProperty("value")) {
        values[key] = value.value;
      } else {
        values[key] = value;
      }
    }

    return values;
  }
}
