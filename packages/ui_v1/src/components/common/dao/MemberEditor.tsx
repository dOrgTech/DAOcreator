import * as React from "react";
import { Grid } from "@material-ui/core";
import { MemberForm } from "@dorgtech/daocreator-lib";
import FormField from "../FormField";

interface Props {
  form: MemberForm;
  editable: boolean;
}

export default class MemberEditor extends React.Component<Props> {
  render() {
    const { form, editable } = this.props;

    return (
      <>
        <Grid item sm={4} xs={12}>
          <FormField field={form.$.address} editable={editable} />
        </Grid>
        <Grid item sm={3} xs={12}>
          <FormField field={form.$.reputation} editable={editable} />
        </Grid>
        <Grid item sm={3} xs={12}>
          <FormField field={form.$.tokens} editable={editable} />
        </Grid>
      </>
    );
  }
}
