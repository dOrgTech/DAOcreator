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
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import { SchemeForm } from "../../../lib/forms";

interface Props extends WithStyles<typeof styles> {
  form: SchemeForm;
  Icon: React.ComponentType<SvgIconProps>;
  editable: boolean;
  onToggle: (toggled: boolean) => void;
}

/*
[Scheme Name] [Toggle]
[Icon]
[Description]
// if (toggle)
[Params]
[Voting Machine Preset Selector][Custom Settings]
[Voting Machine Overview Stats]
*/
class SchemeView extends React.Component<Props> {
  render() {
    const { classes, form, Icon } = this.props;
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
            <Grid
              container
              alignItems="center"
              direction="column"
              justify="center"
            >
              <Grid item xs={6}>
                <Icon color="primary" className={classes.schemeIcon} />
              </Grid>
              <Grid item>
                <Typography variant="body1">{form.description}</Typography>
              </Grid>
            </Grid>
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
    },
    schemeIcon: {
      width: "100%",
      height: "100%"
    }
  });

export default withStyles(styles)(SchemeView);
