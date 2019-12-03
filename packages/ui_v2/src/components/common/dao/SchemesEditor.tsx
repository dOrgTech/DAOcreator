import * as React from "react";
import { observer } from "mobx-react";
import { observable, IObservableObject } from "mobx";
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
  SchemeRegistrarForm,
  SchemeType
} from "@dorgtech/daocreator-lib";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  form: SchemesForm;
  editable: boolean;
}

interface SchemeFormDrawers {
  form: AnySchemeForm;
  enabled: boolean;
  Icon: React.ComponentType<SvgIconProps>;
}

type IconType = React.ComponentType<SvgIconProps>;

@observer
class SchemesEditor extends React.Component<Props> {
  icons: { [type: number]: IconType } = {};
  fillers: { [type: number]: AnySchemeForm & IObservableObject } = {};

  constructor(props: Props) {
    super(props);

    this.icons[SchemeType.ContributionReward] = ContributionRewardIcon;
    this.icons[SchemeType.GenericScheme] = GenericSchemeIcon;
    this.icons[SchemeType.SchemeRegistrar] = SchemeRegistrarIcon;

    this.fillers[SchemeType.ContributionReward] = observable(
      new ContributionRewardForm()
    );
    this.fillers[SchemeType.SchemeRegistrar] = observable(
      new SchemeRegistrarForm()
    );
    this.fillers[SchemeType.GenericScheme] = observable(
      new GenericSchemeForm()
    );
  }

  render() {
    const { classes, form, editable } = this.props;
    const error = form.showFormError;

    let schemes: SchemeFormDrawers[] = [];

    // iterate through each scheme type
    for (const type in SchemeType) {
      // https://tinyurl.com/y33e9j9x
      if (isNaN(Number(type))) {
        break;
      }

      const schemeType: SchemeType = Number(type);
      const index = form.$.findIndex(scheme => scheme.type === schemeType);
      const added = index > -1;

      schemes.push({
        form: added ? form.$[index] : this.fillers[schemeType],
        enabled: added,
        Icon: this.icons[schemeType]
      });
    }

    return (
      <div className={classes.root}>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="center"
          alignItems="baseline"
        >
          {schemes.map((scheme, index) => {
            if (!editable && !scheme.enabled) {
              return <></>;
            }

            return (
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
            );
          })}
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
