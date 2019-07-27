import * as React from "react";
import { observer } from "mobx-react";
import {
  WithStyles,
  Theme,
  createStyles,
  withStyles,
  Card,
  CardContent,
  Grid,
  Typography
} from "@material-ui/core";
import SchemesView from "../../common/dao/SchemesView";
import { SchemesForm } from "../../../lib/forms";

interface Props extends WithStyles<typeof styles> {
  form: SchemesForm;
}

@observer
class SchemesStep extends React.Component<Props> {
  render() {
    const { classes, form } = this.props;

    return <></>;
  }
}

const styles = (theme: Theme) => createStyles({});

export default withStyles(styles)(SchemesStep);
