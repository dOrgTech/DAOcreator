export interface FormCallbacks<Data> {
  onChange(): void
  onValidate(valid: boolean): void
  getData(): Data
}
