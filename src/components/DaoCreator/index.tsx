import * as React from "react"
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

interface Props extends WithStyles<typeof styles> {
  step: number
  stepNext: (currentData: any) => void
  stepBack: () => void
}

type State = {
  daoName: string
  tokenName: string
  tokenSymbol: string
}

class daoCreator extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange = (valueName: string) => (event: any) => {
    this.setState({ [valueName]: event.target.value } as any)
  }

  steps = [
    {
      title: "Name",
      content: <NamingStep {...this.state} handleChange={this.handleChange} />,
    },
    {
      title: "Founders",
      content: <FoundersStep />,
    },
  ]

  render() {
    const { step, stepNext, stepBack, classes } = this.props
    return (
      <div className={classes.root}>
        <Stepper activeStep={step}>
          {this.steps.map(thisStep => (
            <Step key={thisStep.title}>
              <StepLabel>{thisStep.title}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          {step >= this.steps.length ? (
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
              <div className={classes.content}>{this.steps[step].content}</div>
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
                  onClick={() => stepNext(this.state)}
                  className={classes.button}
                >
                  {step === this.steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
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
    stepNext: (formData: any) => dispatch(stepNext(formData)),
    stepBack: () => dispatch(stepBack()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)