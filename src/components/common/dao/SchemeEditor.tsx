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
  Switch,
  Collapse
} from "@material-ui/core";
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import GenesisProtocolPresetEditor from "./GenesisProtocolPresetEditor";
import GenesisProtocolAnalytics from "./GenesisProtocolAnalytics";
import { SchemeForm } from "../../../lib/forms";
import FormField from "../FormField";
import { observer } from "mobx-react";

interface Props extends WithStyles<typeof styles> {
  form: SchemeForm;
  editable: boolean;
  enabled: boolean;
  Icon: React.ComponentType<SvgIconProps>;
  onToggle: (toggled: boolean) => void;
}

interface State {
  enabled: boolean;
}

@observer
class SchemeEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      enabled: this.props.enabled
    };
  }

  render() {
    const { classes, form, editable, Icon } = this.props;
    const { enabled } = this.state;
    const params = form.getParams ? form.getParams() : [];

    const onToggle = (event: object, checked: boolean) => {
      this.props.onToggle(checked);
      this.setState({
        enabled: checked
      });
    };

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
                <Switch
                  disabled={!editable}
                  checked={enabled}
                  onChange={onToggle}
                />
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
            <Collapse in={enabled}>
              <div>
                {params.length > 0 ? (
                  <>
                    <Typography variant="h6">Parameters</Typography>
                    {params.map((param, index) => (
                      <FormField.Text field={param} editable={editable} />
                    ))}
                  </>
                ) : (
                  <></>
                )}
                <Typography variant="h6">Voting Configuration</Typography>
                <GenesisProtocolPresetEditor
                  form={form.$.votingMachine}
                  editable={editable}
                />
                <GenesisProtocolAnalytics form={form.$.votingMachine} />
              </div>
            </Collapse>
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

export default withStyles(styles)(SchemeEditor);
