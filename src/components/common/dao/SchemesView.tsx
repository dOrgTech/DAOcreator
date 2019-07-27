// TODO:
// - memberview
// - add button
// - list of memberview
import * as React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import {
  WithStyles,
  Theme,
  createStyles,
  withStyles,
  Grid
} from "@material-ui/core";
import {
  SchemeForm,
  SchemesForm,
  CreateGenericSchemeForm,
  CreateSchemesForm
} from "../../../lib/forms";

interface Props extends WithStyles<typeof styles> {
  form: SchemesForm;
}

@observer
class SchemesView extends React.Component<Props> {
  @observable schemeForm: SchemeForm = CreateGenericSchemeForm();

  render() {
    const { classes, form } = this.props;
    const schemeForm = this.schemeForm;

    return <></>;
  }
}

const styles = (theme: Theme) => createStyles({});

export default withStyles(styles)(SchemesView);
