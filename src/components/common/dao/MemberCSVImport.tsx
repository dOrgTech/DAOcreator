import * as React from "react";
// import { Grid } from "@material-ui/core";
// import FormField from "../FormField";
// import { MemberForm } from "../../../lib/forms";
import AttachFile from "@material-ui/icons/AttachFile";

interface Props {
  // form: MemberForm;
  // editable: boolean;
}

export default class MemberCSVImport extends React.Component<Props> {
  render() {
    // const { form, editable } = this.props;

    return (
      <>
        <AttachFile />
        {/*<Grid item sm={4} xs={8}>
          <FormField field={form.$.address} editable={editable} />
        </Grid>
        <Grid item sm={3} xs={5}>
          <FormField field={form.$.reputation} editable={editable} />
        </Grid>
        <Grid item sm={3} xs={5}>
          <FormField field={form.$.tokens} editable={editable} />
        </Grid>*/}
      </>
    );
  }
}
