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
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import ContributionRewardIcon from "@material-ui/icons/DonutSmallTwoTone";
import SchemeRegistrarIcon from "@material-ui/icons/WidgetsTwoTone";
import GenericSchemeIcon from "@material-ui/icons/LanguageTwoTone";
import SchemeEditor from "./SchemeEditor";
import {
  SchemesForm,
  SchemeForm,
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

interface SchemeFormIcons {
  form: SchemeForm;
  Icon: React.ComponentType<SvgIconProps>;
}

@observer
class SchemesEditor extends React.Component<Props> {
  @observable
  contributionRewardForm: ContributionRewardForm = CreateContributionRewardForm();

  @observable
  schemeRegistrarForm: SchemeRegistrarForm = CreateSchemeRegistrarForm();

  @observable
  genericSchemeForm: GenericSchemeForm = CreateGenericSchemeForm();

  schemeForms: SchemeFormIcons[] = [
    {
      form: this.contributionRewardForm,
      Icon: ContributionRewardIcon
    },
    {
      form: this.schemeRegistrarForm,
      Icon: SchemeRegistrarIcon
    },
    {
      form: this.genericSchemeForm,
      Icon: GenericSchemeIcon
    }
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
          {this.schemeForms.map(scheme => (
            <SchemeEditor
              form={scheme.form}
              Icon={scheme.Icon}
              editable={true}
              onToggle={(toggled: boolean) => {
                if (toggled) {
                  form.$.push(scheme.form);
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

export default withStyles(styles)(SchemesEditor);
