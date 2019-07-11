import * as React from "react"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import { observer } from "mobx-react"
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
} from "@material-ui/core"
import DAOcreatorActions, * as daoCreatorActions from "../../../lib/redux/actions/daoCreator"
import NamingStep from "./NamingStep"
// import FoundersStep from "./FoundersStep"
// import SchemesStep from "./SchemesStep"
// import ReviewStep from "./ReviewStep"
// import LiveDao from "./LiveDao"
import { DAOcreatorForm, CreateDAOcreatorForm } from "../../../lib/forms"

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  actions: DAOcreatorActions
}

interface State {
  step: number
  stepValid: boolean
}

@observer
class DAOcreator extends React.Component<Props, State> {
  form: DAOcreatorForm = CreateDAOcreatorForm()

  constructor(props: Props) {
    super(props)
    props.actions.init()
    this.state = {
      step: 0,
      stepValid: false,
    }
  }

  render() {
    const { classes, actions } = this.props
    const { step, stepValid } = this.state
    const form = this.form
    const nameForm = form.$.config

    const onValidate = (stepValid: boolean) =>
      this.setState({
        step,
        stepValid,
      })

    const steps = [
      {
        title: "Name",
        component: <NamingStep form={nameForm} onValidate={onValidate} />,
      },
      /*{
        title: "Founders",
        component: <FoundersStep />,
      },
      {
        title: "Features (schemes)",
        component: <SchemesStep />,
      },
      {
        title: "Review & Deploy",
        component: <ReviewStep />,
      },
      {
        title: "Live DAO",
        component: <LiveDao />,
      },*/
    ]

    const isDeployStep = step === steps.length - 2
    const isLastStep = step === steps.length - 1
    return (
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
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    actions: bindActionCreators(daoCreatorActions, dispatch),
  }
}

export default connect(
  null,
  mapDispatchToProps
)(componentWithStyles)
