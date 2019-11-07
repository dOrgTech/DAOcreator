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
import { toDAOMigrationParams, Scheme } from "lib/state";
import { toJSON, SchemeType, ContributionReward, GenesisProtocol, GenesisProtocolConfig, SchemeRegistrar, GenericScheme } from "lib/dependency/arc/types";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> { }

interface State {
  step: number;
  open: boolean;
  daoCreatorSetup: any;
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
  DAO_CREATOR_SETUP: string | null = localStorage.getItem("DAO_CREATOR_SETUP");
  constructor(props: Props) {
    super(props);
    this.state = {
      step: 0,
      open: false,
      daoCreatorSetup: null
    };
  }

  componentDidMount() {
    this.checkSavedData();
    window.addEventListener("beforeunload", this.onUnload);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onUnload);
  }

  checkSavedData() {
    if (this.DAO_CREATOR_SETUP) {
      this.setSavedData(this.DAO_CREATOR_SETUP);
    }
  }

  setSavedData(data: any) {
    const { form } = JSON.parse(data);
    this.setState({
      open: true,
      daoCreatorSetup: JSON.parse(form)
    });
  }

  onUnload = () => {
    const daoState = this.form.toState();
    const daoParams = toDAOMigrationParams(daoState);
    const json = toJSON(daoParams);
    const daoCreatorSetup = {
      step: this.state.step,
      form: json
    };
    const daoCreatorSetupJSON = JSON.stringify(daoCreatorSetup);
    localStorage.setItem("DAO_CREATOR_SETUP", daoCreatorSetupJSON);
  };

  loadSavedData = () => {
    const { step } = JSON.parse(this.DAO_CREATOR_SETUP as string);
    const {
      orgName,
      tokenName,
      tokenSymbol,
      founders
    } = this.state.daoCreatorSetup;
    const daoCreatorState = {
      config: {
        daoName: orgName,
        tokenName,
        tokenSymbol
      },
      members: founders,
      schemes: this.restoreSchemes(this.state.daoCreatorSetup)
    };
    this.setState({
      step,
      open: false
    });
    this.form.fromState(daoCreatorState);
  };

  resetSavedData = () => {
    this.setState({
      step: 0,
      open: false,
      daoCreatorSetup: null
    });
  };

  restoreSchemes = (daoCreatorSetup: any): Array<Scheme> => {
    console.log(daoCreatorSetup)
    let schemes: Scheme[] = [];
    for (let schemeType of Object.keys(daoCreatorSetup.schemes)) {
      let scheme: Scheme | null;
      switch (schemeType) {
        case "ContributionReward": {
          let votingMachine = {
            typeName: "GenesisProtocol",
            config: daoCreatorSetup.VotingMachinesParams[daoCreatorSetup.ContributionReward[0].voteParams] as GenesisProtocolConfig,
          } as GenesisProtocol
          console.log(votingMachine)
          scheme = new ContributionReward(votingMachine);
          break;
        }
        case "SchemeRegistrar": {
          let votingMachine = {
            typeName: "GenesisProtocol",
            config: daoCreatorSetup.VotingMachinesParams[daoCreatorSetup.SchemeRegistrar[0].voteRegisterParams] as GenesisProtocolConfig
          } as GenesisProtocol
          scheme = new SchemeRegistrar(votingMachine);
          break;
        }
        case "UGenericScheme": {
          let votingMachine = {
            typeName: "GenesisProtocol",
            config: daoCreatorSetup.VotingMachinesParams[daoCreatorSetup.UGenericScheme[0].voteParams] as GenesisProtocolConfig
          } as GenesisProtocol
          scheme = new GenericScheme(daoCreatorSetup.UGenericScheme[0].targetContract, votingMachine);
          break;
        }
        default : {
          throw Error(`Schema type ${schemeType} not recognized and cannot be restored from localStorage`);
        }
      }
      schemes.push(scheme)
    }
    return schemes;
  }

  onClose = () => {
    this.setState({ open: false });
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
          onClick={this.loadSavedData}
          size={"small"}
          color={"primary"}
          variant={"contained"}
        >
          Resume
        </Button>
        <Button
          onClick={this.resetSavedData}
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
