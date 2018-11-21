import * as React from "react"
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

interface Step {
  title: string
  content: React.FunctionComponent
}

interface Props extends WithStyles<typeof styles> {
  step: number
  steps: Step[]
  stepperNext: () => void
  stepperBack: () => void
  stepperReset: () => void
}

const HorizontalStepper: React.SFC<Props> = ({
  step,
  steps,
  stepperNext,
  stepperBack,
  stepperReset,
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
          <Typography className={classes.instructions}>
            All steps completed - you&quot;re finished
          </Typography>
          <Button onClick={stepperReset} className={classes.button}>
            Reset
          </Button>
        </div>
      ) : (
        <div>
          <div>{steps[0].content}</div>
          <div>
            <Button
              disabled={step === 0}
              onClick={stepperBack}
              className={classes.button}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={stepperNext}
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

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "90%",
    },
    button: {
      marginRight: theme.spacing.unit,
    },
    instructions: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
    },
  })

export default withStyles(styles)(HorizontalStepper)
