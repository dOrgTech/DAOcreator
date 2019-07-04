import * as R from "ramda"
import { FormCallbacks } from "./FormCallbacks"

export interface FieldConfig {
  description: string
  required: boolean
  default?: any
  setValue: (value: any) => void
  validator: (value: any) => string
}

interface FieldConfigs {
  [field: string]: FieldConfig
}

interface FieldValues {
  [field: string]: any
}

interface FieldErrors {
  [field: string]: string
}

export class Form<Data> {
  private configs: FieldConfigs = {}
  private values: FieldValues = {}
  private errors: FieldErrors = {}

  private callbacks: FormCallbacks<Data>

  constructor(callbacks: FormCallbacks<Data>) {
    this.callbacks = callbacks
  }

  public configureFields(
    ...configs: { field: keyof Data; config: FieldConfig }[]
  ): void {
    configs.forEach(config => this.configureField(config.field, config.config))
  }

  public configureField(field: keyof Data, config: FieldConfig): void {
    this.configs[field as string] = config
    this.resetField(field)
  }

  public getDescription(field: keyof Data): string {
    return this.configs[field as string].description
  }

  public getValue(field: keyof Data): any {
    return this.values[field as string]
  }

  public setValue(field: keyof Data, value: any | undefined): any {
    // set internal state
    this.values[field as string] = value
    console.log(field as string)
    console.log(value)
    console.log("1")

    const config = this.configs[field as string]

    if (!this.hasValue(field)) {
      console.log("2")
      if (config.required) {
        console.log("3")
        // inform the user that this is a required field
        this.setError(field, "This field is required.")
      } else {
        console.log("4")
        // clear the error
        this.setError(field, "")
      }
    } else {
      console.log("5")
      // validate value
      this.setError(field, config.validator(value))
    }

    // set it externally if valid
    if (!this.hasError(field)) {
      console.log("5")
      config.setValue(value)
    }

    this.callbacks.onValidate(this.isValid())
    this.callbacks.onChange()
  }

  public hasValue(field: keyof Data): boolean {
    const value = this.getValue(field)
    return value !== undefined && !R.isEmpty(value)
  }

  public getError(field: keyof Data): string | undefined {
    return this.errors[field as string]
  }

  private setError(field: keyof Data, err: string) {
    this.errors[field as string] = err
  }

  public hasError(field: keyof Data): boolean {
    return !R.isEmpty(this.getError(field))
  }

  public isRequired(field: keyof Data): boolean {
    return this.configs[field as string].required
  }

  public isValid(): boolean {
    const data = this.callbacks.getData()

    // Ensure that:
    // 1. All fields that have a value are valid
    // 2. All required fields have a value set
    return R.none(key => !R.isEmpty(this.errors[key]), R.keys(data))
  }

  public resetField(field: keyof Data): void {
    const data = this.callbacks.getData()
    const config = this.configs[field as string]

    if (data[field]) {
      this.setValue(field, data[field])
    } else {
      this.setValue(field, config.default)
    }
  }
}
