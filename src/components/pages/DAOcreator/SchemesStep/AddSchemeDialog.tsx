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
  getSchemeDefinition,
  getSchemeDefaultParams,
  getVotingMachineDefinition,
  getVotingMachineDefaultParams,
  schemeDefinitions,
  SchemeDefinition,
  SchemeConfig,
  ParamDefinition,
  VotingMachineConfig,
  votingMachineDefinitions,
  initSchemeConfig,
} from "../../../../lib/integrations/arc"

const styles = (theme: Theme) =>
  createStyles({
    dialog: {},
    dialogContent: {
      width: 600,
    },
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
  addedSchemes: SchemeConfig[]
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
  // checks that all values are precent and
  // checks that the form has no errors
  // if so it sets formIsValide to true
  validateForm = async (schemeConfig: SchemeConfig) => {
    const scheme = getSchemeDefinition(schemeConfig.typeName)
    const { params: paramTypes } = scheme
    const { params: paramValues } = schemeConfig
    /*const formErrorObject = FormValidation.generateFormErrors(
      paramTypes,
      paramValues,
      this.state.formErrors
    )
    // check if the form is valide
    const formIsValid = R.none(
      key => !R.isEmpty(formErrorObject[key]),
      R.keys(formErrorObject)
    )

    this.setState({
      formErrors: formErrorObject,
      formIsValid,
    })*/
  }

  validateVotingMachine = async (
    votingMachineConfig: VotingMachineConfig | undefined
  ) => {
    /*if (votingMachineConfig) {
      const votingMachine = getVotingMachineDefinition(
        votingMachineConfig.typeName
      )
      const { params: paramTypes } = votingMachine
      const { params: paramValues } = votingMachineConfig
      const formErrorObject = FormValidation.generateFormErrors(
        paramTypes,
        paramValues,
        this.state.formErrors
      )

      // check if the form is valide
      const formIsValid = R.none(
        key => !R.isEmpty(formErrorObject[key]),
        R.keys(formErrorObject)
      )

      this.setState({
        formErrors: formErrorObject,
        formIsValid,
      })
    }*/
  }

  validateParam = async (paramDefinition: ParamDefinition, value: string) => {
    /*if (value == null || (R.isEmpty(value) && paramDefinition.optional)) {
      this.setState({
        formErrors: {
          ...this.state.formErrors,
          [paramDefinition.typeName]: "",
        },
      })
    } else {
      let errorMessage = ""
      switch (paramDefinition.valueType) {
        case "Address": {
          errorMessage = FormValidation.isAddress(value)
          break
        }
        case "number": {
          errorMessage = FormValidation.isBigNumber(value)
          break
        }
        default: {
        }
      }

      this.setState({
        formErrors: {
          ...this.state.formErrors,
          [paramDefinition.typeName]: errorMessage,
        },
      })
    }*/
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
    paramDefinition: ParamDefinition,
    value: any
  ) => {
    const { id, typeName, params } = this.state.schemeConfig
    await this.validateParam(paramDefinition, value)
    await this.setState({
      schemeConfig: {
        id,
        typeName,
        params: R.assoc(paramDefinition.typeName, value, params),
      },
    })

    await this.validateForm(this.state.schemeConfig)
  }

  addOrUpdateVotingMachineConfig = async (
    votingMachineConfig: VotingMachineConfig | undefined
  ) => {
    const { id, typeName, params } = this.state.schemeConfig
    await this.setState({
      schemeConfig: {
        id,
        typeName,
        votingMachineConfig: votingMachineConfig,
        params,
      },
    })
    await this.validateVotingMachine(votingMachineConfig)
  }

  handleSchemeConfigParamsChange = (paramDefinition: ParamDefinition) => async (
    event: any
  ) => {
    const { value } = event.target
    await this.addOrUpdateSchemeParam(paramDefinition, value)
  }

  handleVotingMachineParamsChange = (
    paramDefinition: ParamDefinition
  ) => async (event: any) => {
    const { value } = event.target
    const oldVotingMachineConfig = this.state.schemeConfig.votingMachineConfig
    await this.validateParam(paramDefinition, value)
    const newVotingMachineConfig =
      oldVotingMachineConfig != null
        ? {
            typeName: oldVotingMachineConfig.typeName,
            params: R.assoc(
              paramDefinition.typeName,
              value,
              oldVotingMachineConfig.params
            ),
          }
        : undefined
    await this.addOrUpdateVotingMachineConfig(newVotingMachineConfig)
  }

  handleVotingMachineTypeChange = async (event: any) => {
    const { value: newTypeName } = event.target
    const newVotingMachineConfig: VotingMachineConfig = {
      typeName: newTypeName,
      params: getVotingMachineDefaultParams(newTypeName),
    }

    await this.addOrUpdateVotingMachineConfig(newVotingMachineConfig)
  }

  handleReset = () => {
    this.setState({
      activeStep: 0,
      schemeConfig: initSchemeConfig(),
      formIsValid: false,
    })
  }

  schemeIsAdded = (typeName: string) =>
    R.any(scheme => scheme.typeName === typeName, this.props.addedSchemes)

  handleClose = () => {
    this.props.close()
    this.handleReset()
  }

  handleSave = () => {
    const { schemeConfig } = this.state
    const { typeName: schemeTypeName } = schemeConfig
    if (!R.isEmpty(schemeTypeName)) {
      this.props.addScheme(schemeConfig)
      this.handleClose()
    } else {
      throw Error(
        "There is a bug; it should not be possible to call 'handleSave' when 'schemeType' is undefined"
      )
    }
  }

  setSchemeType = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { schemeConfig } = this.state
    const { id } = schemeConfig
    const schemeTypeName = event.target.value
    const params = getSchemeDefaultParams(schemeTypeName)
    const newSchemeConfig = { id, typeName: schemeTypeName, params }
    this.setState({
      schemeConfig: newSchemeConfig,
    })
    await this.validateForm(newSchemeConfig)
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

  selectSchemeStep = (
    schemeDefinition: SchemeDefinition | null,
    classes: any
  ) => (
    <Step key={"selectSchemeStep"}>
      <StepLabel>Select Scheme</StepLabel>
      <StepContent>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="scheme-select">Scheme</InputLabel>
          <Select
            className={classes.select}
            value={schemeDefinition != null ? schemeDefinition.typeName : ""}
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
              scheme =>
                !this.schemeIsAdded(scheme.typeName) ||
                scheme.daoCanHaveMultiple ? (
                  <MenuItem
                    value={scheme.typeName}
                    key={"select-item-" + scheme.typeName}
                  >
                    {scheme.displayName}
                  </MenuItem>
                ) : null,
              schemeDefinitions
            )}
          </Select>
        </FormControl>
        {schemeDefinition != null ? (
          <Typography className={classes.description}>
            {schemeDefinition.description}
          </Typography>
        ) : null}
        {this.stepControls(true, false, schemeDefinition != null, classes)}
      </StepContent>
    </Step>
  )
  configureSchemeStep = (
    schemeDefinition: SchemeDefinition | null,
    schemeConfig: SchemeConfig,
    isLastStep: boolean,
    classes: any
  ) => {
    if (schemeDefinition == null) {
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
                    error={
                      R.has(param.typeName, this.state.formErrors) &&
                      !R.isEmpty(this.state.formErrors[param.typeName])
                    }
                    margin="normal"
                    onChange={this.handleSchemeConfigParamsChange(param)}
                    value={R.propOr("", param.typeName, schemeConfig.params)}
                    fullWidth
                    required={!R.pathOr(false, ["optional"], param)}
                  />
                  <Typography gutterBottom>
                    <i>{param.description}</i>
                  </Typography>
                </div>
              ),
              schemeDefinition.params
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
    votingMachineConfig: VotingMachineConfig,
    classes: any
  ) => {
    const votingMachine = getVotingMachineDefinition(
      votingMachineConfig.typeName
    )
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
              }, R.values(votingMachineDefinitions))}
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
    votingMachineConfig: VotingMachineConfig,
    classes: any
  ) => {
    const votingMachine = getVotingMachineDefinition(
      votingMachineConfig.typeName
    )
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
                  error={
                    R.has(param.typeName, this.state.formErrors) &&
                    !R.isEmpty(this.state.formErrors[param.typeName])
                  }
                  onChange={this.handleVotingMachineParamsChange(param)}
                  value={
                    votingMachineConfig != null
                      ? R.prop(
                          param.typeName,
                          votingMachineConfig.params as any
                        )
                      : ""
                  }
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
          {this.stepControls(false, true, this.state.formIsValid, classes)}
        </StepContent>
      </Step>
    )
  }

  render() {
    const { classes, open } = this.props
    const { activeStep, schemeConfig } = this.state
    const { typeName: schemeTypeName } = schemeConfig
    const schemeDefinition = getSchemeDefinition(schemeTypeName)
    const votingMachineConfig = schemeConfig.votingMachineConfig || {
      typeName: "",
      params: [],
    }
    const hasVotingMachine =
      schemeDefinition != null ? schemeDefinition.hasVotingMachine : false

    return (
      <Dialog open={open} className={classes.dialog}>
        <DialogTitle>Add a Scheme</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <DialogContentText>
            Select a Scheme and configure it parameters.
          </DialogContentText>
          <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {this.selectSchemeStep(schemeDefinition, classes)}
              {schemeDefinition != null && schemeDefinition.params.length > 0
                ? this.configureSchemeStep(
                    schemeDefinition,
                    schemeConfig,
                    !hasVotingMachine,
                    classes
                  )
                : null}

              {schemeDefinition != null && hasVotingMachine
                ? [
                    this.selectVotingMachineStep(
                      votingMachineConfig as VotingMachineConfig,
                      classes
                    ),
                    this.configureVotingMachineStep(
                      votingMachineConfig as VotingMachineConfig,
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
