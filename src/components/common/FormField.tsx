import * as React from "react";
import {
  FormControl,
  FormHelperText,
  TextField,
  Tooltip
} from "@material-ui/core";
import { StringField } from "../../lib/forms";
import { observer } from "mobx-react";

class FormField {
  public static Text = observer(
    (props: { field: StringField; editable?: boolean }) => {
      const { field, editable } = props;

      return (
        <FormControl fullWidth>
          <Tooltip title={field.description} placement={"top-start"}>
            <TextField
              fullWidth
              label={field.displayName}
              variant={"filled"}
              error={field.hasError}
              value={field.value}
              disabled={editable === undefined ? false : !editable}
              onChange={e => field.onChange(e.target.value)}
              onBlur={field.enableAutoValidationAndValidate}
            />
          </Tooltip>
          <FormHelperText error={field.hasError}>{field.error}</FormHelperText>
        </FormControl>
      );
    }
  );
}

export default FormField;
