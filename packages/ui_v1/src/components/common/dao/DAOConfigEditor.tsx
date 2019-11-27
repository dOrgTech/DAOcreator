import * as React from "react";
import { Grid } from "@material-ui/core";
import { DAOConfigForm } from "@dorgtech/daocreator-lib";
import FormField from "../FormField";

interface Props {
  form: DAOConfigForm;
  editable: boolean;
}

export default class DAOConfigEditor extends React.Component<Props> {
  render() {
    const { form, editable } = this.props;

    return (
      <>
        <Grid item xs={12} md={7}>
          <Grid item xs={12}>
            <FormField field={form.$.daoName} editable={editable} />
          </Grid>
          <Grid item xs={12}>
            <FormField field={form.$.tokenName} editable={editable} />
          </Grid>
          <Grid item xs={12}>
            <FormField field={form.$.tokenSymbol} editable={editable} />
          </Grid>
        </Grid>
      </>
    );
  }
}
