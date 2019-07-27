import * as React from "react";
import {
  Theme,
  createStyles,
  WithStyles,
  withStyles,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch
} from "@material-ui/core";
import { SchemeForm } from "../../../lib/forms";

interface Props extends WithStyles<typeof styles> {
  form: SchemeForm;
  editable: boolean;
  onToggle: (toggled: boolean) => void;
}

class SchemeView extends React.Component<Props> {
  render() {
    const { classes, form } = this.props;
    return (
      <Grid item>
        <Card className={classes.card}>
          <CardContent>
            <Grid
              container
              alignItems="flex-start"
              direction="row"
              justify="space-between"
            >
              <Grid item>
                <Typography variant="h5" component="h2">
                  {form.displayName}
                </Typography>
              </Grid>
              <Grid item>
                <Switch />
              </Grid>
            </Grid>
            <Typography>{form.description}</Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    card: {
      maxWidth: 400
    }
  });

export default withStyles(styles)(SchemeView);
