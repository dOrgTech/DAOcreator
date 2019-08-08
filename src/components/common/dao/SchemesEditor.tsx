// TODO: warning if they don't have contribution reward or scheme registrar. Default these?
import * as React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import {
  WithStyles,
  Theme,
  createStyles,
  withStyles,
  Grid,
  Typography
} from "@material-ui/core";
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import ContributionRewardIcon from "@material-ui/icons/DonutSmallTwoTone";
import SchemeRegistrarIcon from "@material-ui/icons/WidgetsTwoTone";
import GenericSchemeIcon from "@material-ui/icons/LanguageTwoTone";
import SchemeEditor from "./SchemeEditor";
import {
  SchemesForm,
  AnySchemeForm,
  GenericSchemeForm,
  ContributionRewardForm,
  SchemeRegistrarForm
} from "../../../lib/forms";

interface Props extends WithStyles<typeof styles> {
  form: SchemesForm;
  editable: boolean;
}

interface SchemeFormDrawers {
  form: AnySchemeForm;
  enabled: boolean;
  Icon: React.ComponentType<SvgIconProps>;
}

@observer
class SchemesEditor extends React.Component<Props> {
  @observable
  contributionRewardForm = new ContributionRewardForm();

  @observable
  schemeRegistrarForm = new SchemeRegistrarForm();

  @observable
  genericSchemeForm = new GenericSchemeForm();

  schemeForms: SchemeFormDrawers[] = [
    {
      form: this.contributionRewardForm,
      enabled: true,
      Icon: ContributionRewardIcon
    },
    {
      form: this.schemeRegistrarForm,
      enabled: true,
      Icon: SchemeRegistrarIcon
    },
    {
      form: this.genericSchemeForm,
      enabled: false,
      Icon: GenericSchemeIcon
    }
  ];

  // TODO: add schemes, and set SchemeRegistrar default to critical
  render() {
    const { classes, form, editable } = this.props;
    const error = form.showFormError;
    const schemes = editable
      ? this.schemeForms
      : this.schemeForms.filter(
          scheme =>
            form.$.findIndex(added => added.type === scheme.form.type) > -1
        );

    return (
      <div className={classes.root}>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="center"
          alignItems="baseline"
        >
          {schemes.map((scheme, index) => (
            <SchemeEditor
              form={scheme.form}
              Icon={scheme.Icon}
              editable={editable}
              enabled={scheme.enabled}
              onToggle={(toggled: boolean) => {
                if (toggled) {
                  form.$.push(scheme.form);
                } else {
                  const index = form.$.findIndex(
                    test => test.type === scheme.form.type
                  );

                  if (index === -1) {
                    throw Error(
                      "Trying to remove scheme that hasn't been added."
                    );
                  }

                  form.$.splice(index, 1);
                }
              }}
              key={`scheme-${index}`}
            />
          ))}
        </Grid>
        {error ? <Typography color={"error"}>{form.error}</Typography> : <></>}
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
