import * as React from "react";
import {
  WithStyles,
  Theme,
  createStyles,
  withStyles,
  Grid
} from "@material-ui/core";
import FormField from "../FormField";
import EthAddressAvatar from "../EthAddressAvatar";
import { MemberForm, GetStringOrEmpty } from "../../../lib/forms";

interface Props extends WithStyles<typeof styles> {
  form: MemberForm;
  editable: boolean;
}

class MemberEditor extends React.Component<Props> {
  render() {
    const { classes, form, editable } = this.props;
    const address = GetStringOrEmpty(form.$.address);

    return (
      <>
        <Grid item xs={"auto"} className={classes.avatar}>
          <EthAddressAvatar address={address} />
        </Grid>
        <Grid item sm={4} xs={8}>
          <FormField.Text field={form.$.address} editable={editable} />
        </Grid>
        <Grid item sm={3} xs={5}>
          <FormField.Text field={form.$.reputation} editable={editable} />
        </Grid>
        <Grid item sm={3} xs={5}>
          <FormField.Text field={form.$.tokens} editable={editable} />
        </Grid>
      </>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    avatar: {
      alignSelf: "center"
    }
  });

export default withStyles(styles)(MemberEditor);
