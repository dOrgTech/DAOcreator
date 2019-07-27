// TODO:
// - tiles for each scheme that can be enabled
// - - scheme params at top level in tile
// - - each tile has a selector for genesis proocol presets
// - - settings button next to protocol selector to set custom values
// - - high level statistics about the voting machine
// TODO: warning if they don't have contribution reward or scheme registrar. Default these?
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
import SchemeView from "./SchemeView";
import {
  SchemesForm,
  GenericSchemeForm,
  ContributionRewardForm,
  SchemeRegistrarForm,
  CreateGenericSchemeForm,
  CreateContributionRewardForm,
  CreateSchemeRegistrarForm
} from "../../../lib/forms";

interface Props extends WithStyles<typeof styles> {
  form: SchemesForm;
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

/*
  <SchemeView type={SchemeType.GenericScheme} editable={true} onToggle={(schemeForm) => ...} />
*/
@observer
class SchemesView extends React.Component<Props> {
  @observable
  contributionRewardForm: ContributionRewardForm = CreateContributionRewardForm();
  @observable
  schemeRegistrarForm: SchemeRegistrarForm = CreateSchemeRegistrarForm();
  @observable genericSchemeForm: GenericSchemeForm = CreateGenericSchemeForm();

  schemeForms = [
    this.contributionRewardForm,
    this.schemeRegistrarForm,
    this.genericSchemeForm
  ];

  render() {
    const { classes, form } = this.props;

    return (
      <div className={classes.root}>
        <Grid
          container
          spacing={16}
          direction="row"
          justify="center"
          alignItems="baseline"
        >
          {this.schemeForms.map(schemeForm => (
            <SchemeView
              form={schemeForm}
              editable={true}
              onToggle={(toggled: boolean) => {
                if (toggled) {
                  form.$.push(schemeForm);
                } else {
                  // TODO: form.$.findIndex()
                }
              }}
            />
          ))}
        </Grid>
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    }
  });

export default withStyles(styles)(SchemesView);
