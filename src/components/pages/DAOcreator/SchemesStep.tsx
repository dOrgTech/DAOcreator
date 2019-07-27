import * as React from "react";
import { observer } from "mobx-react";
import {
  WithStyles,
  Theme,
  createStyles,
  withStyles,
  Card,
  CardContent,
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
    const { form } = this.props;

    return (
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Add Schemes
          </Typography>
          <SchemesView form={form} />
        </CardContent>
      </Card>
    );
  }
}

const styles = (theme: Theme) => createStyles({});

export default withStyles(styles)(SchemesStep);
