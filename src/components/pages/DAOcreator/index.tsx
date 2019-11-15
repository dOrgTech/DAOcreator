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
import { getWeb3 } from "lib/dependency/web3";

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
  open: boolean;
  isMigrating: boolean;
  showWeb3Dialog: boolean;
  recoverPreviewOpen: boolean;
  recoverNoticeOpen: boolean;
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
      showWeb3Dialog: true,
      open: false,
      isMigrating: false,
      recoverNoticeOpen: false,
      recoverPreviewOpen: false
    };
  }

  componentDidMount() {
    if (localStorage.getItem(DAO_CREATOR_STATE)) {
      this.setState({
        ...this.state,
        recoverNoticeOpen: true
      });
    }

    window.addEventListener('load', async () => {
      this.ensureNetworkConnected()
    })

    window.addEventListener("beforeunload", this.saveLocalStorage);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.saveLocalStorage);
  }

  ensureNetworkConnected = () => {
    const Web3 = require('web3');

    // check again in 2 seconds to see if user has enabled wallet.
    if (!Web3.givenProvider) {
      setTimeout(this.ensureNetworkConnected, 2000)
    } else {
      this.setState({ showWeb3Dialog: false })
    }

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
      recoverNoticeOpen: false,
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
      step,
      recoverNoticeOpen: false,
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
      recoverPreviewOpen: true
    });
  };

  onClose = () => {
    this.setState({
      ...this.state,
      recoverNoticeOpen: false,
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
          dao: this.form.toState(),
          onStart: () => {
            this.setState({ isMigrating: true })
          },
          onComplete: () => {
            this.setState({ isMigrating: false })
          }
        }
      }
    ];
    const { classes } = this.props;
    const { step,
      recoverNoticeOpen,
      recoverPreviewOpen,
      isMigrating,
      showWeb3Dialog } = this.state;
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

    const PreviewDialog = () => (
      <Dialog open={recoverPreviewOpen} fullWidth={true} maxWidth="lg">
        <DialogTitle id="simple-dialog-title">Preview</DialogTitle>
        <DialogContent>
          <ReviewStep form={this.recoveredForm} />
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

    const SavedDataDialog = () => (
      <Dialog open={recoverNoticeOpen} fullWidth={true}>
        <DialogTitle id="simple-dialog-title">Saved DAO Detected.</DialogTitle>
        <DialogContent>
          <DialogContentText>Resume from where you left off?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.previewLocalStorage}
            size={"small"}
            color={"default"}
            variant={"contained"}
          >
            Preview
          </Button>

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

    const NoWalletDialog = () => (
      <Dialog open={showWeb3Dialog} >
        <DialogTitle id="simple-dialog-title">
          We are unable to detect a connected wallet.
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You need a wallet in order to deploy a DAO. Please install the Metamask Chrome extension or Brave web browser to continue.
          </DialogContentText>
        </DialogContent>
        <DialogActions>

          <Button
            target="blank"
            href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
            size={"small"}
            color={"primary"}
            variant={"contained"}
          >
            Download Metamask
          </Button>
          <Button
            target="blank"
            href="https://brave.com/download"
            size={"small"}
            color={"primary"}
            variant={"contained"}
          >
            Download Brave
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
              <ArrowBack /> Back
              </Fab>
            {!isLastStep ?
              <Fab
                variant="extended"
                color="primary"
                onClick={nextStep}
                className={classes.fab + ', ' + classes.rightFab}
                size="large"

              >
                Next <ArrowForward className={classes.extendedIcon} />
              </Fab> : ''}
          </div>
        </div>
        <Support />
        <SavedDataDialog />
        <NoWalletDialog />
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
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'stretch',
      maxWidth: 1024,
      flexGrow: 1,
      padding: '3vh',
      margin: '0 auto'
    },
    stepper: {
    },
    content: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    fab: {
    },
    rightFab: {
      float: 'right'
    },
    fabsContainer: {
      marginTop: theme.spacing(1),
      zIndex: 10
    },
    extendedIcon: {
      marginRight: theme.spacing(-.8),
      marginLeft: theme.spacing(.9)
    }
  });

export default withStyles(styles)(DAOcreator);
