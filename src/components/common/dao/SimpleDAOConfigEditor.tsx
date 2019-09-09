import * as React from "react";
import { Grid } from "@material-ui/core";
import FormField from "components/common/FormField";
import { SimpleDAOConfigForm } from "lib/forms";

interface Props {
  form: SimpleDAOConfigForm;
  editable: boolean;
}

export default class SimpleDAOConfigEditor extends React.Component<Props> {
  render() {
    const { form, editable } = this.props;

    return (
      <>
        <Grid item xs={12} md={7}>
          <Grid item xs={12}>
            <FormField field={form.$.daoName} editable={editable} />
          </Grid>
          <Grid item xs={12}>
            <FormField field={form.$.daoSymbol} editable={editable} />
          </Grid>
        </Grid>
      </>
    );
  }
}
