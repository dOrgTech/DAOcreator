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
  DialogTitle
} from "@material-ui/core";

import NamingStep from "./NamingStep";
import MembersStep from "./MembersStep";
import SchemesStep from "./SchemesStep";
import ReviewStep from "./ReviewStep";
import DeployStep from "./DeployStep";
import Support from "components/common/Support";
import { DAOForm, DAOConfigForm, MembersForm, SchemesForm } from "lib/forms";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {}

interface State {
  step: number;
  open: boolean;
}

interface Step {
  title: string;
  form: DAOForm | DAOConfigForm | MembersForm | SchemesForm;
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
      open: false
    };
    this.onUnload = this.onUnload.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  onUnload() {
    const daoCreatorSetup = {
      step: this.state.step,
      form: this.form
    };
    const daoCreatorSetupJSON = JSON.stringify(daoCreatorSetup);
    localStorage.setItem("DAO_CREATOR_SETUP", daoCreatorSetupJSON);
  }

  componentDidMount() {
    this.checkSavedData();
    window.addEventListener("beforeunload", this.onUnload);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onUnload);
  }

  savedData(data: any) {
    const parsedDAOCreatorSetup: any = JSON.parse(data);
    this.setState({
      step: parsedDAOCreatorSetup.step,
      open: true
    });
    console.log("this.forn", this.form);
    console.log("parsedDAOCreatorSetup.form", parsedDAOCreatorSetup.form);
    // this.form = new DAOForm()
    // this.form = parsedDAOCreatorSetup.form
  }

  checkSavedData() {
    const DAO_CREATOR_SETUP = localStorage.getItem("DAO_CREATOR_SETUP");
    if (DAO_CREATOR_SETUP) {
      this.savedData(DAO_CREATOR_SETUP);
    }
  }

  onClose() {
    this.setState({ open: false });
  }

  render() {
    const steps: Step[] = [
      {
        title: "Name",
        form: this.form.$.config,
        Component: NamingStep,
        props: {
          daoForm: this.form,
          toReviewStep: () => {
            this.setState({
              step: 3
            });
          }
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
      <Dialog onClose={this.onClose} open={open}>
        <DialogTitle id="simple-dialog-title">
          We have saved data from last session do you want to resume with it?
        </DialogTitle>
        <Button
          onClick={() => {
            console.log("Resume");
          }}
          size={"small"}
          color={"primary"}
          variant={"contained"}
        >
          Resume
        </Button>
        <Button
          onClick={() => {
            console.log("Start Over");
          }}
          size={"small"}
          color={"primary"}
          variant={"contained"}
        >
          Start Over
        </Button>
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
