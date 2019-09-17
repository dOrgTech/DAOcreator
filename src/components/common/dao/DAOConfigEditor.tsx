import * as React from "react";
import { Grid } from "@material-ui/core";
import FormField from "components/common/FormField";
import { DAOConfigForm } from "lib/forms";

interface Props {
  form: DAOConfigForm;
  editable: boolean;
}

export default class DAOConfigEditor extends React.Component<Props> {
  render() {
    const { form, editable } = this.props;

    return form.$.expertConfig ? (
      <>
        <Grid item xs={12} md={7}>
          <Grid item xs={12}>
            <FormField
              field={form.$.expertConfig.daoName}
              editable={editable}
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              field={form.$.expertConfig.tokenName}
              editable={editable}
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              field={form.$.expertConfig.tokenSymbol}
              editable={editable}
            />
          </Grid>
        </Grid>
      </>
    ) : (
      <>
        <Grid item xs={12} md={7}>
          <Grid item xs={12}>
            <FormField
              field={form.$.simpleConfig.daoName}
              editable={editable}
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              field={form.$.simpleConfig.daoSymbol}
              editable={editable}
            />
          </Grid>
        </Grid>
      </>
    );
  }
}
