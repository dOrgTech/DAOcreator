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
  Button,
  Dialog,
  DialogTitle,
  DialogActions
} from "@material-ui/core";

import NamingStep from "./NamingStep";
import MembersStep from "./MembersStep";
import SchemesStep from "./SchemesStep";
import ReviewStep from "./ReviewStep";
import DeployStep from "./DeployStep";
import Support from "components/common/Support";
import {
  DAOForm,
  DAOConfigForm,
  MembersForm,
  SchemesForm,
  SimpleDAOConfigForm
} from "lib/forms";
import { toDAOMigrationParams, fromDAOMigrationParams } from "lib/state";
import { toJSON, fromJSON } from "lib/dependency/arc/types";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {}

interface State {
  step: number;
  simple: Boolean;
  open: boolean;
}

interface Step {
  title: string;
  form:
    | DAOForm
    | DAOConfigForm
    | MembersForm
    | SchemesForm
    | SimpleDAOConfigForm;
  Component: any;
  props?: {
    [name: string]: any;
  };
}

// Local Storage Key + Values
const DAO_CREATOR_STATE = "DAO_CREATOR_SETUP";
interface DAO_CREATOR_STATE {
  step: number;
  form: string;
}

class DAOcreator extends React.Component<Props, State> {
  form = new DAOForm();

  constructor(props: Props) {
    super(props);
    this.state = {
      step: 0,
      simple: true,
      open: false
    };
  }

  componentDidMount() {
    if (localStorage.getItem(DAO_CREATOR_STATE)) {
      this.setState({
        ...this.state,
        open: true
      });
    }

    window.addEventListener("beforeunload", this.saveLocalStorage);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.saveLocalStorage);
  }

  saveLocalStorage = () => {
    const daoState = this.form.toState();
    const daoParams = toDAOMigrationParams(daoState);
    const json = toJSON(daoParams);
    const daoCreatorState: DAO_CREATOR_STATE = {
      step: this.state.step,
      form: json
    };

    localStorage.setItem(DAO_CREATOR_STATE, JSON.stringify(daoCreatorState));
  };

  resetLocalStorage = () => {
    localStorage.removeItem(DAO_CREATOR_STATE);

    this.setState({
      step: 0,
      open: false
    });
  };

  loadLocalStorage = () => {
    const daoCreatorState = localStorage.getItem(DAO_CREATOR_STATE);

    if (!daoCreatorState) {
      return;
    }

    const { step, form } = JSON.parse(daoCreatorState) as DAO_CREATOR_STATE;
    const daoParams = fromJSON(form);
    const daoState = fromDAOMigrationParams(daoParams);
    this.form.fromState(daoState);

    this.setState({
      step,
      open: false
    });
  };

  onClose = () => {
    this.setState({ ...this.state, open: false });
  };

  render() {
    const steps: Step[] = [
      {
        title: "Name",
        form: this.state.simple
          ? this.form.$.config
          : this.form.$.config.toForm(),
        Component: NamingStep,
        props: {
          daoForm: this.form,
          toReviewStep: () => {
            this.setState({
              step: 3
            });
          },
          updateConfig: () => this.setState({ simple: !this.state.simple })
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
          getDAOTokenSymbol: () => this.form.$.config.$.daoSymbol.value
        }
      },
      {
        title: "Review",
        form: this.form,
        Component: ReviewStep,
        props: {
          setStep: (step: number) => {
            this.setState({
              step
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
    const { step, open } = this.state;
    const isLastStep = step === steps.length - 1;
    const { form, Component, props } = steps[step];

    const previousStep = async () => {
      this.setState({
        step: this.state.step - 1
      });
    };

    const nextStep = async () => {
      const res = await form.validate();
      const { step } = this.state;

      if (!res.hasError) {
        this.setState({
          step: step + 1
        });
      } else {
        if (form.error) {
          this.setState({
            step
          });
        } else {
          this.setState({
            step
          });
        }
      }
    };

    const SavedDataDialog = () => (
      <Dialog open={open}>
        <DialogTitle id="simple-dialog-title">
          Resume from where you left off?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={this.loadLocalStorage}
            size={"small"}
            color={"primary"}
            variant={"contained"}
          >
            Resume
          </Button>
          <Button
            onClick={this.resetLocalStorage}
            size={"small"}
            color={"primary"}
            variant={"contained"}
          >
            Start Over
          </Button>
        </DialogActions>
      </Dialog>
    );

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
        <SavedDataDialog />
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
