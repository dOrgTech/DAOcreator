import * as React from "react"
import * as R from "ramda"
import { connect } from "react-redux"
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
import { stepNext, stepBack } from "../../state/actions/daoCreator"
import NamingStep from "./NamingStep"
import FoundersStep from "./FoundersStep"
import ConfigurationStep from "./ConfigurationStep"
import ReviewStep from "./ReviewStep"
import { createDao } from "../../state/actions/daoCreator"

interface Props extends WithStyles<typeof styles> {
  step: number
  stepNext: (isLastStep: boolean) => void
  stepBack: () => void
}

const daoCreator: React.SFC<Props> = ({
  classes,
  step,
  stepNext,
  stepBack,
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
      title: "Review",
      component: <ReviewStep />,
    },
  ]

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
        {step >= steps.length ? (
          <div>
            <Typography className={classes.content}>
              All steps completed - you&quot;re finished
            </Typography>
            <Button onClick={stepBack} className={classes.button}>
              Back
            </Button>
          </div>
        ) : (
          <div>
            <div className={classes.content}>{steps[step].component}</div>
            <div>
              <Button
                variant="contained"
                color="primary"
                disabled={step === 0}
                onClick={stepBack}
                className={classes.button}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => stepNext(isLastStep)}
                className={classes.button}
              >
                {isLastStep ? "Finish" : "Next"}
              </Button>
            </div>
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
    },
    content: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
    },
  })

const componentWithStyles = withStyles(styles)(daoCreator)

// STATE
const mapStateToProps = (state: any, ownProps: any) => {
  return {
    step: state.daoCreator.step,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    stepNext: (isLastStep: boolean) => {
      dispatch(stepNext())
      if (isLastStep) {
        // create DAO
        dispatch(createDao())
      }
    },
    stepBack: () => dispatch(stepBack()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
