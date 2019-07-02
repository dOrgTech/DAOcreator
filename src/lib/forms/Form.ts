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

  public setValue(field: keyof Data, value: any): any {
    // set internal state
    this.values[field as string] = value

    // validate value
    const config = this.configs[field as string]
    this.errors[field as string] = config.validator(value)

    // set it externally if valid
    if (!this.hasError(field)) {
      config.setValue(value)
    }

    this.callbacks.onValidate(this.isValid())
    this.callbacks.onChange()
  }

  public isRequired(field: keyof Data): boolean {
    return this.configs[field as string].required
  }

  public getError(field: keyof Data): string | undefined {
    return this.errors[field as string]
  }

  public hasError(field: keyof Data): boolean {
    return !R.isEmpty(this.getError(field))
  }

  public isValid(): boolean {
    const data = this.callbacks.getData()
    return R.none(
      key => this.errors[key] === undefined || !R.isEmpty(this.errors[key]),
      R.keys(data)
    )
  }

  public resetField(field: keyof Data): void {
    const data = this.callbacks.getData()
    const config = this.configs[field as string]

    if (data[field]) {
      this.setValue(field, data[field])
    } else if (config.default) {
      this.setValue(field, config.default)
    }
  }
}
