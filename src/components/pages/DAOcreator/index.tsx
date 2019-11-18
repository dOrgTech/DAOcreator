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
  DialogActions,
  DialogContent,
  Fab,
  DialogContentText
} from "@material-ui/core";
import ArrowBack from "@material-ui/icons/ArrowBackIos";
import ArrowForward from "@material-ui/icons/ArrowForwardIos";
import NamingStep from "./NamingStep";
import MembersStep from "./MembersStep";
import SchemesStep from "./SchemesStep";
import ReviewStep from "./ReviewStep";
import DeployStep from "./DeployStep";
import Support from "components/common/Support";
import { DAOForm, DAOConfigForm, MembersForm, SchemesForm } from "lib/forms";
import { toDAOMigrationParams, fromDAOMigrationParams } from "lib/state";
import { toJSON, fromJSON } from "lib/dependency/arc/types";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> { }

interface State {
  step: number;
  isMigrating: boolean;
  recoverPreviewOpen: boolean;
}

interface Step {
  title: string;
  form: DAOForm | DAOConfigForm | MembersForm | SchemesForm;
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
  recoveredForm = new DAOForm();

  constructor(props: Props) {
    super(props);
    this.state = {
      step: 0,
      isMigrating: false,
      recoverPreviewOpen: false
    };
  }

  componentDidMount() {
    // Preview a saved DAO if one is found
    this.previewLocalStorage();
    window.addEventListener("beforeunload", this.saveLocalStorage);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.saveLocalStorage);
  }

  saveLocalStorage = () => {
    const daoState = this.form.toState();

    // Check to see if the current form state hasn't been edited,
    // and if so early out so we don't save an empty state
    const nullForm = new DAOForm();
    if (JSON.stringify(daoState) === JSON.stringify(nullForm.toState())) {
      return;
    }

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
      ...this.state,
      step: 0,
      recoverPreviewOpen: false
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
      ...this.state,
      step,
      recoverPreviewOpen: false
    });
  };

  previewLocalStorage = () => {
    const daoCreatorState = localStorage.getItem(DAO_CREATOR_STATE);

    if (!daoCreatorState) {
      return;
    }

    const { form } = JSON.parse(daoCreatorState) as DAO_CREATOR_STATE;
    const daoParams = fromJSON(form);
    const daoState = fromDAOMigrationParams(daoParams);
    this.recoveredForm.fromState(daoState);

    this.setState({
      ...this.state,
      recoverPreviewOpen: true
    });
  };

  onClose = () => {
    this.setState({
      ...this.state,
      recoverPreviewOpen: false
    });
  };

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
              ...this.state,
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
              ...this.state,
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
          dao: this.form.toState(),
          onStart: () => {
            this.setState({
              ...this.state,
              isMigrating: true
            });
          },
          onStop: () => {
            this.setState({
              ...this.state,
              isMigrating: false
            });
          },
          onComplete: () => {
            this.setState({
              ...this.state,
              isMigrating: false
            });
          }
        }
      }
    ];
    const { classes } = this.props;
    const { step, recoverPreviewOpen, isMigrating } = this.state;
    const isLastStep = step === steps.length - 1;
    const { form, Component, props } = steps[step];

    const previousStep = async () => {
      this.setState({
        ...this.state,
        step: this.state.step - 1
      });
    };

    const nextStep = async () => {
      const res = await form.validate();
      const { step } = this.state;

      if (!res.hasError) {
        this.setState({
          ...this.state,
          step: step + 1
        });
      } else {
        if (form.error) {
          this.setState({
            ...this.state,
            step
          });
        } else {
          this.setState({
            ...this.state,
            step
          });
        }
      }
    };

    const PreviewDialog = () => (
      <Dialog open={recoverPreviewOpen} fullWidth={true} maxWidth="md">
        <DialogTitle id="simple-dialog-title">
          In Progress DAO Detected
        </DialogTitle>
        <DialogContent>
          <ReviewStep form={this.recoveredForm} disableHeader />
        </DialogContent>
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
          <div className={classes.fabsContainer}>
            <Fab
              variant="extended"
              color="primary"
              disabled={step === 0 || isMigrating}
              onClick={previousStep}
              className={classes.fab}
              size="large"
            >
              <ArrowBack />
              Back
            </Fab>
            {!isLastStep ? (
              <Fab
                variant="extended"
                color="primary"
                onClick={nextStep}
                className={classes.fab + ", " + classes.rightFab}
                size="large"
              >
                Next
                <ArrowForward className={classes.extendedIcon} />
              </Fab>
            ) : (
                ""
              )}
          </div>
        </div>
        <Support />
        <PreviewDialog />
      </>
    );
  }
}

// STYLE
const styles = (theme: Theme) =>
  createStyles({
    root: {
      // bring forward (infront of background)
      zIndex: 2,
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "stretch",
      maxWidth: 1024,
      flexGrow: 1,
      padding: "3vh",
      margin: "0 auto"
    },
    stepper: {},
    content: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    },
    fab: {},
    rightFab: {
      float: "right"
    },
    fabsContainer: {
      zIndex: 10
    },
    extendedIcon: {
      marginRight: theme.spacing(-0.8),
      marginLeft: theme.spacing(0.9)
    }
  });

export default withStyles(styles)(DAOcreator);
