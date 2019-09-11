import * as React from "react";
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles,
  Stepper,
  Step,
  StepLabel,
  Card,
  Button
} from "@material-ui/core";
import NamingStep from "./NamingStep";
import MembersStep from "./MembersStep";
import SchemesStep from "./SchemesStep";
import ReviewStep from "./ReviewStep";
import DeployStep from "./DeployStep";
import Support from "components/common/Support";
import {
  DAOForm,
  MemberForm,
  ContributionRewardForm,
  GenesisProtocolForm,
  GenesisProtocolFormOpts,
  SchemeRegistrarForm,
  GenericSchemeForm
} from "lib/forms";
import { FormState } from "formstate";
import { DAOcreatorState, fromDAOMigrationParams } from "lib/state";
import {
  deserialize,
  DAOMigrationParams,
  GenesisProtocolConfig,
  GenesisProtocol,
  GenesisProtocolOpts
} from "lib/dependency/arc";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {}

interface State {
  step: number;
  error: string;
}

interface Step {
  title: string;
  form: FormState<any>;
  Component: any;
  props?: {
    [name: string]: any;
  };
}

class DAOcreator extends React.Component<Props, State> {
  form = new DAOForm();

  constructor(props: Props) {
    super(props);
    this.state = {
      step: 0,
      error: ""
    };
  }

  render() {
    const updateForms = (params: string) => {
      const daoParams: DAOMigrationParams = deserialize(params);
      const deserializedParams: DAOcreatorState = fromDAOMigrationParams(
        daoParams
      );
      //this is going to be refactored into another function
      const { daoName, tokenName, tokenSymbol } = deserializedParams.config;

      this.form.$.config.$.daoName.value = daoName;
      this.form.$.config.$.tokenName.value = tokenName;
      this.form.$.config.$.tokenSymbol.value = tokenSymbol;

      const getDAOTokenSymbol = () => {
        return tokenSymbol;
      };

      deserializedParams.members.forEach(founder => {
        const member = new MemberForm(getDAOTokenSymbol);
        member.$.address.value = founder.address;
        member.$.reputation.value = founder.reputation.toString();
        member.$.tokens.value = founder.tokens.toString();

        this.form.$.members.$.push(member);
      });

      deserializedParams.schemes.forEach(scheme => {
        const schemeObject: any = {};
        schemeObject.$ = {};
        const config = scheme.votingMachine.getParameters()[0];

        Object.keys(config).forEach(type => {
          schemeObject["$"][type] = { value: config[type] };
        });

        const protocolConfig: GenesisProtocolConfig = schemeObject;
        const votingMachine: GenesisProtocolOpts = { config: protocolConfig };
        const protocol = new GenesisProtocol(votingMachine);
        const params = new GenesisProtocolForm(protocol);
        const formOpts: GenesisProtocolFormOpts = { form: params };
        const finalForm = new GenesisProtocolForm(formOpts);
        switch (scheme.constructor.name) {
          case "SchemeRegistrar":
            let schemeRegistrar = new SchemeRegistrarForm();
            schemeRegistrar.$.votingMachine = finalForm;
            this.form.$.schemes.$.push(schemeRegistrar);
            break;
          case "ContributionReward":
            let contributionReward = new ContributionRewardForm();
            contributionReward.$.votingMachine = finalForm;
            this.form.$.schemes.$.push(contributionReward);
            break;
          case "GenericScheme":
            let genericScheme = new GenericSchemeForm();
            genericScheme.$.votingMachine = finalForm;
            this.form.$.schemes.$.push(genericScheme);
            break;
        }
      });
    };

    const steps: Step[] = [
      {
        title: "Name",
        form: this.form.$.config,
        Component: NamingStep,
        props: {
          sendToReviewStep: () => {
            this.setState({
              step: 3,
              error: ""
            });
          },
          updateForms: updateForms
        }
      },
      {
        title: "Schemes",
        form: this.form.$.schemes,
        Component: SchemesStep
      },
      {
        title: "Members",
        form: this.form.$.members,
        Component: MembersStep,
        props: {
          getDAOTokenSymbol: () => this.form.$.config.$.tokenSymbol.value
        }
      },
      {
        title: "Review",
        form: this.form,
        Component: ReviewStep,
        props: {
          setStep: (step: number) => {
            this.setState({
              step,
              error: ""
            });
          }
        }
      },
      {
        title: "Deploy",
        form: this.form,
        Component: DeployStep,
        props: {
          dao: this.form.toState()
        }
      }
    ];
    const { classes } = this.props;
    const { step } = this.state;
    const isLastStep = step === steps.length - 1;
    const { form, Component, props } = steps[step];

    const previousStep = async () => {
      this.setState({
        step: this.state.step - 1,
        error: ""
      });
    };

    const nextStep = async () => {
      const res = await form.validate();
      const { step } = this.state;

      if (!res.hasError) {
        this.setState({
          step: step + 1,
          error: ""
        });
      } else {
        if (form.error) {
          this.setState({
            step,
            error: form.error
          });
        } else {
          this.setState({
            step,
            error: "Unknown Error."
          });
        }
      }
    };

    return (
      <>
        <div className={classes.root}>
          <Card>
            <Stepper className={classes.stepper} activeStep={step}>
              {steps.map(thisStep => (
                <Step key={thisStep.title}>
                  <StepLabel>{thisStep.title}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Card>
          <div className={classes.content}>
            <Component form={form} {...props} />
          </div>
          <div>
            <Button
              variant={"contained"}
              color={"primary"}
              disabled={step === 0}
              onClick={previousStep}
              className={classes.button}
            >
              Back
            </Button>
            {isLastStep ? (
              <></>
            ) : (
              <Button
                variant={"contained"}
                color={"primary"}
                onClick={nextStep}
                className={classes.button}
              >
                Next
              </Button>
            )}
          </div>
        </div>
        <Support />
      </>
    );
  }
}

// STYLE
const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: 30,
      paddingTop: 50,
      justifySelf: "center",
      // bring forward (infront of background)
      position: "relative",
      pointerEvents: "none",
      maxWidth: 1000,
      margin: "auto"
    },
    stepper: {
      pointerEvents: "all"
    },
    content: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      pointerEvents: "all"
    },
    button: {
      marginRight: theme.spacing(1),
      backgroundColor: "rgba(167, 167, 167, 0.77)!important", //TODO: find out why desabled buttons disapper, then fix it and remove this
      pointerEvents: "all"
    }
  });

export default withStyles(styles)(DAOcreator);
