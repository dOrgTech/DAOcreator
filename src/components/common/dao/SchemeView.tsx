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
import GenesisProtocolSelector from "./GensisProtocolSelector";
import { SchemeForm, GenesisProtocolForm } from "../../../lib/forms";
import FormField from "../FormField";

interface Props extends WithStyles<typeof styles> {
  form: SchemeForm;
  Icon: React.ComponentType<SvgIconProps>;
  editable: boolean;
  onToggle: (toggled: boolean) => void;
}

/*
[*Scheme Name] [*Toggle]
[*Icon]
[*Description]
// if (toggle)
[*Params]
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
                <Typography variant="h4">{form.displayName}</Typography>
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
                <Typography
                  variant="body1"
                  className={classes.schemeDescription}
                >
                  {form.description}
                </Typography>
              </Grid>
            </Grid>
            {form.getParams ? (
              <>
                <Typography variant="h6">Parameters</Typography>
                {form.getParams().map((param, index) => (
                  <FormField.Text
                    id={`param-${index}`}
                    field={param}
                    editable={true}
                  />
                ))}
              </>
            ) : (
              <></>
            )}
            <Typography variant="h6">Voting Configuration</Typography>
            <GenesisProtocolSelector
              onSelect={(genesisProtocol: GenesisProtocolForm) => {
                form.$.votingMachine = genesisProtocol;
              }}
            />
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    card: {
      minWidth: 410,
      maxWidth: 420
    },
    schemeIcon: {
      width: "100%",
      height: "100%"
    },
    schemeDescription: {
      marginBottom: 15
    }
  });

export default withStyles(styles)(SchemeView);
