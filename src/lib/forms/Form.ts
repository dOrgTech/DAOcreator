import * as R from "ramda"

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

  private onChange: () => void
  private onFormValidate: (valid: boolean) => void
  private getData: () => Data

  constructor(
    onChange: () => void,
    onFormValidate: (valid: boolean) => void,
    getData: () => Data
  ) {
    this.onChange = onChange
    this.onFormValidate = onFormValidate
    this.getData = getData
  }

  public configureFields(
    ...configs: { field: keyof Data; config: FieldConfig }[]
  ): void {
    configs.forEach(config => this.configureField(config.field, config.config))
  }

  public configureField(field: keyof Data, config: FieldConfig): void {
    this.configs[field as string] = config

    const data = this.getData()
    if (data[field]) {
      this.setValue(field, data[field])
    } else if (config.default) {
      this.setValue(field, config.default)
    }
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

    this.onFormValidate(this.hasErrors())
    this.onChange()
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

  public hasErrors(): boolean {
    const data = this.getData()
    return R.none(
      key => this.errors[key] === undefined || !R.isEmpty(this.errors[key]),
      R.keys(data)
    )
  }
}
