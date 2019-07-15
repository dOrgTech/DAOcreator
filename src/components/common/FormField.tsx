import * as React from "react";
import { FormControl, FormHelperText, TextField } from "@material-ui/core";
import { StringField } from "../../lib/forms";
import { observer } from "mobx-react";

class FormField {
  public static Text = observer(
    (props: {
      id: string;
      label: string;
      field: StringField;
      editable?: boolean;
    }) => {
      const { id, label, field, editable } = props;

      return (
        <FormControl fullWidth>
          <TextField
            fullWidth
            label={label}
            variant={"filled"}
            error={field.hasError}
            id={id}
            value={field.value}
            disabled={editable === undefined ? false : !editable}
            onChange={e => field.onChange(e.target.value)}
            onBlur={field.enableAutoValidationAndValidate}
          />
          <FormHelperText error={field.hasError}>{field.error}</FormHelperText>
        </FormControl>
      );
    }
  );
}

export default FormField;
