import * as React from "react"
import { TextField } from "@material-ui/core"
import { Form } from "../../lib/forms"

export class FormDrawer {
  public static Text = <Data extends {}>(props: {
    field: keyof Data
    form: Form<Data>
    styleClass?: string
  }) => {
    const { field, form, styleClass } = props

    // TODO: check, for the existance of this field in the form

    return (
      <TextField
        name={field as string}
        label={form.getDescription(field)}
        value={form.getValue(field)}
        onChange={async (event: any) =>
          form.setValue(field, event.target.value)
        }
        required={form.isRequired(field)}
        error={form.hasError(field)}
        helperText={form.getError(field)}
        className={styleClass ? styleClass : (field as string)}
        margin="normal"
        fullWidth
      />
    )
  }
}
