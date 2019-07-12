import * as React from "react"
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Input,
} from "@material-ui/core"
import { StringField } from "../../lib/forms"
import { observer } from "mobx-react"

class FormField {
  public static Text = observer(
    (props: { id: string; label: string; field: StringField }) => {
      const { id, label, field } = props

      return (
        <FormControl fullWidth>
          <InputLabel error={field.hasError} htmlFor={id}>
            {label}
          </InputLabel>
          <Input
            fullWidth
            error={field.hasError}
            id={id}
            value={field.value}
            onChange={e => field.onChange(e.target.value)}
            onBlur={field.enableAutoValidationAndValidate}
          />
          <FormHelperText error={field.hasError}>{field.error}</FormHelperText>
        </FormControl>
      )
    }
  )
}

export default FormField
