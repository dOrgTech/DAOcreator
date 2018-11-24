import * as React from "react"
import { connect } from "react-redux"
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles,
  Stepper,
  Step,
  Typography,
  Button,
} from "@material-ui/core"
import { stepNext, stepBack } from "../../state/actions/daoCreator"

interface Step {
  title: string
  content: React.SFC
}

interface Props extends WithStyles<typeof styles> {
  step: number
  steps: Step[]
  stepNext: () => void
  stepBack: () => void
}

const SetupStepper: React.SFC<Props> = ({
  step,
  steps,
  stepNext,
  stepBack,
  classes,
}) => (
  <div className={classes.root}>
    <Stepper activeStep={step}>
      {steps.map(thisStep => (
        <Step key={thisStep.title} />
      ))}
    </Stepper>
    <div>
      {step === steps.length ? (
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
          <div className={classes.content}>{steps[step].content}</div>
          <div>
            <Button
              disabled={step === 0}
              onClick={stepBack}
              className={classes.button}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={stepNext}
              className={classes.button}
            >
              {step === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      )}
    </div>
  </div>
)

// STYLE
const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "90%",
    },
    button: {
      marginRight: theme.spacing.unit,
    },
    content: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
    },
  })

const componentWithStyles = withStyles(styles)(SetupStepper)

// STATE
const mapStateToProps = (state: any, ownProps: any) => {
  return {
    // TODO: find out why state.step is never set.
    step: state.step ? state.step : 0,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    stepperNext: () => dispatch(stepNext()),
    stepperBack: () => dispatch(stepBack()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
