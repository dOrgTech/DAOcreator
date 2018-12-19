import * as React from "react"
import * as R from "ramda"
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
  Typography,
  Button,
} from "@material-ui/core"
import DaoCreatorActions, * as daoCreatorActions from "../../redux/actions/daoCreator"
import NamingStep from "./NamingStep"
import FoundersStep from "./FoundersStep"
import ConfigurationStep from "./ConfigurationStep"
import ReviewStep from "./ReviewStep"
import LiveDao from "./LiveDao"
import { AppState } from "src/AppState"

interface Props extends WithStyles<typeof styles> {
  step: number
  stepValide: boolean
  actions: DaoCreatorActions
}

const daoCreator: React.SFC<Props> = ({
  classes,
  step,
  stepValide,
  actions,
}) => {
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
      title: "Configuration",
      component: <ConfigurationStep />,
    },
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
      <Stepper activeStep={step}>
        {steps.map(thisStep => (
          <Step key={thisStep.title}>
            <StepLabel>{thisStep.title}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        <div>
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
                disabled={!stepValide}
              >
                {isDeployStep ? "Deploy DAO" : "Next"}
              </Button>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  )
}

// STYLE
const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "90%",
      height: "200",
      margin: "auto",
    },
    button: {
      marginRight: theme.spacing.unit,
      backgroundColor: "rgba(167, 167, 167, 0.77)!important", //TODO: find out why desabled buttons disapper, then fix it and remove this
    },
    content: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
    },
  })

const componentWithStyles = withStyles(styles)(daoCreator)

// STATE
const mapStateToProps = (state: AppState, ownProps: any) => {
  return {
    step: state.daoCreator.step,
    stepValide: state.daoCreator.stepValidation[state.daoCreator.step],
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
