import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core"
import * as R from "ramda"
import * as React from "react"
import {
  getScheme,
  getVotingMachine,
  getVotingMachineDefaultParams,
  schemes,
  Scheme,
  SchemeConfig,
  VotingMachineConfiguration,
  votingMachines,
  initSchemeConfig,
} from "../../../../lib/integrations/daoStack/arc"
import * as FormValidation from "../../../../lib/formValidation"

const styles = (theme: Theme) =>
  createStyles({
    formControl: {
      minWidth: 120,
    },
    root: {
      width: "90%",
    },
    button: {
      marginTop: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    actionsContainer: {
      marginBottom: theme.spacing.unit * 2,
    },
    resetContainer: {
      padding: theme.spacing.unit * 3,
    },
    description: {
      fontStyle: "italic",
    },
    guidingText: {
      marginBottom: 20,
      marginTop: 20,
    },
    select: {
      marginBottom: 20,
    },
  })

interface Props extends WithStyles<typeof styles> {
  open: boolean
  addScheme: (schemeConfig: SchemeConfig) => void
  close: () => void
}

interface State {
  activeStep: number
  schemeConfig: SchemeConfig
  formErrors: any
  formIsValid: boolean
}

class VerticalLinearStepper extends React.Component<Props, State> {
  public readonly state: State = {
    activeStep: 0,
    schemeConfig: initSchemeConfig(),
    formErrors: {},
    formIsValid: false,
  }

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }))
  }

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }))
  }

  addOrUpdateSchemeParam = async (
    paramName: string,
    value: any,
    valueType: string
  ) => {
    const { id, typeName, params } = this.state.schemeConfig
    let errorMessage = ""

    switch (valueType) {
      case "Address": {
        errorMessage = FormValidation.isValidAddress(value)
        break
      }
      case "number": {
        errorMessage = FormValidation.isBigNumber(value)
        break
      }
    }

    await this.setState({
      schemeConfig: {
        id,
        typeName,
        params: R.assoc(paramName, value, params),
      },
      formErrors: { [paramName]: errorMessage },
    })

    const formIsValid = R.none(
      key => !R.isEmpty(this.state.formErrors[key]),
      R.keys(this.state.formErrors)
    )

    this.setState({ formIsValid })
  }

  handleSchemeConfigParamsChange = async (event: any, valueType: string) => {
    const { name, value } = event.target
    await this.addOrUpdateSchemeParam(name, value, valueType)
  }

  handleVotingMachineParamsChange = async (event: any, valueType: string) => {
    const { name, value } = event.target
    const oldVotingMachineConfig = this.state.schemeConfig.params
      .votingMachineConfig
    const newVotingMachineConfig =
      oldVotingMachineConfig != null
        ? {
            typeName: oldVotingMachineConfig.typeName,
            params: R.assoc(name, value, oldVotingMachineConfig.params),
          }
        : { typeName: "", params: [] }
    await this.addOrUpdateSchemeParam(
      "votingMachineConfig",
      newVotingMachineConfig,
      valueType
    )
  }

  handleVotingMachineTypeChange = async (event: any) => {
    const { value: newTypeName } = event.target
    const newVotingMachineConfig: VotingMachineConfiguration = {
      typeName: newTypeName,
      params: getVotingMachineDefaultParams(newTypeName),
    }
    await this.addOrUpdateSchemeParam(
      "votingMachineConfig",
      newVotingMachineConfig,
      newTypeName
    )
  }

  handleReset = () => {
    this.setState({
      activeStep: 0,
      schemeConfig: initSchemeConfig(),
      formIsValid: false,
    })
  }

  handleClose = () => {
    this.props.close()
    this.handleReset()
  }

  handleSave = () => {
    const { schemeConfig } = this.state
    const { typeName: schemeTypeName, params: schemeParams } = schemeConfig
    const { votingMachineConfig } = schemeParams
    if (!R.isEmpty(schemeTypeName)) {
      this.props.addScheme(schemeConfig)
      this.handleClose()
    } else {
      throw Error(
        "There is a bug; it should not be possible to call 'handleSave' when 'schemeType' is undefined"
      )
    }
  }

  setSchemeType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { schemeConfig } = this.state
    const { id, params } = schemeConfig
    this.setState({
      schemeConfig: { id, typeName: event.target.value, params },
    })
  }

  stepControls = (
    firstStep: boolean,
    lastStep: boolean,
    nextEnabled: boolean,
    classes: any
  ) => (
    <div className={classes.actionsContainer}>
      <div>
        <Button
          disabled={firstStep}
          onClick={this.handleBack}
          className={classes.button}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={lastStep ? this.handleSave : this.handleNext}
          disabled={!nextEnabled}
          className={classes.button}
        >
          {lastStep ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  )

  selectSchemeStep = (scheme: Scheme | null, classes: any) => (
    <Step key={"selectSchemeStep"}>
      <StepLabel>Select Scheme</StepLabel>
      <StepContent>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="scheme-select">Scheme</InputLabel>
          <Select
            className={classes.select}
            value={scheme != null ? scheme.typeName : ""}
            onChange={this.setSchemeType}
            inputProps={{
              name: "Scheme",
              id: "scheme-select",
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {R.map(
              scheme => (
                <MenuItem
                  value={scheme.typeName}
                  key={"select-item-" + scheme.typeName}
                >
                  {scheme.displayName}
                </MenuItem>
              ),
              schemes
            )}
          </Select>
        </FormControl>
        {scheme != null ? (
          <Typography className={classes.description}>
            {scheme.description}
          </Typography>
        ) : null}
        {this.stepControls(true, false, scheme != null, classes)}
      </StepContent>
    </Step>
  )
  configureSchemeStep = (
    scheme: Scheme | null,
    schemeConfig: SchemeConfig,
    isLastStep: boolean,
    classes: any
  ) => {
    const schemeParamsWithoutVotingMachineConfig =
      scheme != null
        ? R.filter(
            param => param.typeName != "votingMachineConfig",
            scheme.params
          )
        : []

    if (scheme == null || schemeParamsWithoutVotingMachineConfig.length == 0) {
      return null
    } else {
      return (
        <Step key={"configureSchemeStep"}>
          <StepLabel>Configure Scheme</StepLabel>
          <StepContent>
            {R.map(
              param => (
                <div key={`text-field-${param.typeName}`}>
                  <TextField
                    name={param.typeName}
                    label={param.displayName}
                    error={!R.isEmpty(this.state.formErrors[param.typeName])}
                    margin="normal"
                    onChange={e =>
                      this.handleSchemeConfigParamsChange(e, param.valueType)
                    }
                    value={R.pathOr(
                      param.defaultValue,
                      [param.typeName],
                      schemeConfig.params
                    )}
                    onBlur={() => console.log("TODO: validate fields")}
                    fullWidth
                    required={!R.pathOr(false, ["optional"], param)}
                  />
                  <Typography gutterBottom>
                    <i>{param.description}</i>
                  </Typography>
                </div>
              ),
              schemeParamsWithoutVotingMachineConfig
            )}
            {this.stepControls(
              false,
              isLastStep,
              this.state.formIsValid,
              classes
            )}
          </StepContent>
        </Step>
      )
    }
  }
  selectVotingMachineStep = (
    votingMachineConfig: VotingMachineConfiguration,
    classes: any
  ) => {
    const votingMachine = getVotingMachine(votingMachineConfig.typeName)
    return (
      <Step key={"selectVotingMachineStep"}>
        <StepLabel>Select Voting Machine</StepLabel>
        <StepContent>
          <Typography className={classes.guidingText}>
            What type of voting should be used for this scheme?
          </Typography>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="voting-machine">Voting Machine</InputLabel>
            <Select
              className={classes.select}
              onChange={this.handleVotingMachineTypeChange}
              value={votingMachine != null ? votingMachine.typeName : ""}
              inputProps={{
                name: "votingMachine",
                id: "voting-machine",
              }}
            >
              {R.map(votingMachine => {
                return (
                  <MenuItem
                    key={`voting-machine-select-${votingMachine.typeName}`}
                    value={votingMachine.typeName}
                  >
                    {votingMachine.displayName}
                  </MenuItem>
                )
              }, R.values(votingMachines))}
            </Select>
          </FormControl>
          {votingMachine != null ? (
            <Typography className={classes.description}>
              {votingMachine.description}
            </Typography>
          ) : null}
          {this.stepControls(false, false, votingMachine != null, classes)}
        </StepContent>
      </Step>
    )
  }
  configureVotingMachineStep = (
    votingMachineConfig: VotingMachineConfiguration,
    classes: any
  ) => {
    const votingMachine = getVotingMachine(votingMachineConfig.typeName)
    return (
      <Step key={"configureVotingMachineStep"}>
        <StepLabel>Configure Voting Machine</StepLabel>
        <StepContent>
          <Typography className={classes.guidingText}>
            Specify Voting Machine parameters
          </Typography>
          {R.map(
            param => (
              <div key={`text-field-${param.typeName}`}>
                <TextField
                  name={param.typeName}
                  label={param.displayName}
                  margin="normal"
                  error={!R.isEmpty(this.state.formErrors[param.typeName])}
                  onChange={e =>
                    this.handleVotingMachineParamsChange(e, param.valueType)
                  }
                  value={
                    votingMachineConfig != null
                      ? R.prop(
                          param.typeName,
                          votingMachineConfig.params as any
                        )
                      : ""
                  }
                  onBlur={() => console.log("TODO: validate fields")}
                  fullWidth
                  required={!R.pathOr(false, ["optional"], param)}
                />
                <Typography gutterBottom>
                  <i>{param.description}</i>
                </Typography>
              </div>
            ),
            votingMachine != null ? votingMachine.params : []
          )}
          {this.stepControls(false, true, true, classes)}
        </StepContent>
      </Step>
    )
  }

  render() {
    const { classes, open } = this.props
    const { activeStep, schemeConfig } = this.state
    const { typeName: schemeTypeName, params: schemeParams } = schemeConfig
    const scheme = getScheme(schemeTypeName)
    const shouldHaveVotingMachine =
      scheme != null
        ? R.any(
            param => param.typeName === "votingMachineConfig",
            scheme.params
          )
        : null
    const votingMachineConfig = schemeConfig.params.votingMachineConfig || {
      typeName: "",
      params: [],
    }

    return (
      <Dialog open={open}>
        <DialogTitle>Select Scheme</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a Scheme and configure its voting machine and other
            parameters.
          </DialogContentText>
          <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {this.selectSchemeStep(scheme, classes)}
              {this.configureSchemeStep(
                scheme,
                schemeConfig,
                !shouldHaveVotingMachine,
                classes
              )}

              {scheme != null && shouldHaveVotingMachine
                ? [
                    this.selectVotingMachineStep(
                      votingMachineConfig as VotingMachineConfiguration,
                      classes
                    ),
                    this.configureVotingMachineStep(
                      votingMachineConfig as VotingMachineConfiguration,
                      classes
                    ),
                  ]
                : null}
            </Stepper>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withStyles(styles)(VerticalLinearStepper)
