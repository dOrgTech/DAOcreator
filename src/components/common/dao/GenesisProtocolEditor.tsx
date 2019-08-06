import * as React from "react";
import { WithStyles, Theme, createStyles, withStyles } from "@material-ui/core";
import FormField from "../FormField";
import { GenesisProtocolForm } from "../../../lib/forms";

interface Props extends WithStyles<typeof styles> {
  form: GenesisProtocolForm;
  editable: boolean;
}

class GenesisProtocolEditor extends React.Component<Props> {
  render() {
    const { classes, form, editable } = this.props;
    const formState = form.$ as any;

    // TODO: make this the default behaviour of all form components
    // All editors should just be this, and the fields themselves should contain
    // a type. Then overrides can be made.
    return (
      <>
        {Object.keys(formState).map((propName: string, index: number) => (
          <FormField.Text
            field={formState[propName]}
            editable={editable}
            key={`genproto-field-${index}`}
          />
        ))}
      </>
    );
  }
}

const styles = (theme: Theme) => createStyles({});

export default withStyles(styles)(GenesisProtocolEditor);
