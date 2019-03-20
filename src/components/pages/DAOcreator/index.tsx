import * as React from "react"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles,
  Stepper,
  Step,
  StepLabel,
  Button,
} from "@material-ui/core"
import DAOcreatorActions, * as daoCreatorActions from "../../../redux/actions/daoCreator"
import NamingStep from "./NamingStep"
import FoundersStep from "./FoundersStep"
import FeatureStep from "./FeatureStep"
import ReviewStep from "./ReviewStep"
import LiveDao from "./LiveDao"
import { RootState } from "../../../state"

interface Props extends WithStyles<typeof styles> {
  step: number
  stepValid: boolean
  actions: DAOcreatorActions
}

class DAOcreator extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    props.actions.init()
  }

  render() {
    const { classes, step, stepValid, actions } = this.props
    const steps = [
      {
        title: "Name",
        component: <NamingStep />,
      },
      {
        title: "Founders",
        component: <FoundersStep />,
      },
      {
        title: "ContributionReward",
        component: (
          <div>
            <FeatureStep schemeTypeName="ContributionReward" />
          </div>
        ),
      },
      {
        title: "SchemeRegistrar",
        component: <FeatureStep schemeTypeName="SchemeRegistrar" />,
      },
      {
        title: "UpgradeScheme",
        component: (
          <div>
            <FeatureStep schemeTypeName="UpgradeScheme" />
          </div>
        ),
      },
      {
        title: "GlobalConstraintRegistrar",
        component: <FeatureStep schemeTypeName="GlobalConstraintRegistrar" />,
      },
      //      {
      //        title: "Voting",
      //        component: <VotingStep />,
      //      },
      {
        title: "Review & Deploy",
        component: <ReviewStep />,
      },
      {
        title: "Live DAO",
        component: <LiveDao />,
      },
    ]

    const isDeployStep = step === steps.length - 2
    const isLastStep = step === steps.length - 1
    return (
      <div className={classes.root}>
        <Stepper className={classes.stepper} activeStep={step}>
          {steps.map(thisStep => (
            <Step key={thisStep.title}>
              <StepLabel>{thisStep.title}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className={classes.content}>{steps[step].component}</div>
        {isLastStep ? (
          <></>
        ) : (
          <div>
            <Button
              variant="contained"
              color="primary"
              disabled={step === 0}
              onClick={actions.prevStep}
              className={classes.button}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={isDeployStep ? actions.createDao : actions.nextStep}
              className={classes.button}
              disabled={!stepValid}
            >
              {isDeployStep ? "Deploy DAO" : "Next"}
            </Button>
          </div>
        )}
      </div>
    )
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
      margin: "auto",
    },
    stepper: {
      pointerEvents: "all",
    },
    content: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
      pointerEvents: "all",
    },
    button: {
      marginRight: theme.spacing.unit,
      backgroundColor: "rgba(167, 167, 167, 0.77)!important", //TODO: find out why desabled buttons disapper, then fix it and remove this
      pointerEvents: "all",
    },
  })

const componentWithStyles = withStyles(styles)(DAOcreator)

// STATE
const mapStateToProps = (state: RootState, ownProps: any) => {
  return {
    step: state.daoCreator.step,
    stepValid: state.daoCreator.stepValidation[state.daoCreator.step],
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    actions: bindActionCreators(daoCreatorActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
