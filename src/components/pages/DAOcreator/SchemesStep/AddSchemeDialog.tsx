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
  SchemeConfig,
  VotingMachineConfiguration,
  votingMachines,
} from "../../../../lib/integrations/daoStack/arc"

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
  addScheme: (
    schemeType: string,
    schemeConfig: SchemeConfig,
    votingMachineConfig: VotingMachineConfiguration
  ) => void
  close: () => void
}

interface State {
  activeStep: number
  schemeTypeName: string
  schemeConfig: SchemeConfig | undefined
  votingMachineConfig: VotingMachineConfiguration | undefined
}

class VerticalLinearStepper extends React.Component<Props, State> {
  public readonly state: State = {
    activeStep: 0,
    schemeTypeName: "",
    schemeConfig: undefined,
    votingMachineConfig: undefined,
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

  handleSchemeConfigParamsChange = async (event: any) => {
    const { name, value } = event.target
    if (this.state.schemeConfig != null) {
      await this.setState({
        schemeConfig: {
          id: this.state.schemeTypeName,
          typeName: this.state.schemeConfig.typeName,
          params: R.assoc(name, value, this.state.schemeConfig.params),
        },
      })
    }
  }

  handleVotingMachineParamsChange = async (event: any) => {
    const { name, value } = event.target
    if (this.state.votingMachineConfig != null) {
      await this.setState({
        votingMachineConfig: {
          typeName: this.state.votingMachineConfig.typeName,
          params: R.assoc(name, value, this.state.votingMachineConfig.params),
        },
      })
    }
  }

  handleReset = () => {
    this.setState({
      activeStep: 0,
      schemeTypeName: "",
      schemeConfig: undefined,
      votingMachineConfig: undefined,
    })
  }

  updateSchemeConfig = (
    schemeTypeName: string,
    schemeConfig: SchemeConfig,
    votingMachineConfig: VotingMachineConfiguration
  ) => {
    console.log(schemeTypeName)
    console.log(votingMachineConfig)
    this.setState({
      schemeTypeName,
      schemeConfig,
      votingMachineConfig,
    })
  }

  handleClose = () => {
    this.props.close()
    this.handleReset()
  }

  handleSave = () => {
    const { schemeTypeName, votingMachineConfig, schemeConfig } = this.state
    if (
      !R.isEmpty(schemeTypeName) &&
      votingMachineConfig != null &&
      schemeConfig != null
    ) {
      this.props.addScheme(schemeTypeName, schemeConfig, votingMachineConfig)
      this.handleClose()
    } else {
      throw Error(
        "There is a bug; it should not be possible to call 'handleSave' when 'schemeType' and/or 'votingMAchineCinfig' are undefined"
      )
    }
  }

  setScheme = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ schemeTypeName: event.target.value })
  }

  stepControlls = (
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

  render() {
    const { classes, open } = this.props
    const { activeStep, schemeTypeName, votingMachineConfig } = this.state
    const scheme = getScheme(schemeTypeName)
    const votingMachine =
      votingMachineConfig != null
        ? getVotingMachine(votingMachineConfig.typeName)
        : undefined

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
              <Step>
                <StepLabel>Select Scheme</StepLabel>
                <StepContent>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="scheme-select">Scheme</InputLabel>
                    <Select
                      className={classes.select}
                      value={this.state.schemeTypeName}
                      onChange={this.setScheme}
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
                          <MenuItem value={scheme.typeName}>
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
                  {this.stepControlls(true, false, scheme != null, classes)}
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Configure Scheme</StepLabel>
                {R.map(
                  param => (
                    <div key={`text-field-${param.typeName}`}>
                      <TextField
                        name={param.typeName}
                        label={param.displayName}
                        margin="normal"
                        onChange={this.handleVotingMachineParamsChange}
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
                  scheme != null && scheme.params.length > 0
                    ? scheme.params
                    : []
                )}
              </Step>
              <Step>
                <StepLabel>Select Voting Machine</StepLabel>
                <StepContent>
                  <Typography className={classes.guidingText}>
                    What type of voting should be used for this scheme?
                  </Typography>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="voting-machine">
                      Voting Machine
                    </InputLabel>
                    <Select
                      className={classes.select}
                      onChange={async (event: any) => {
                        await this.setState({
                          votingMachineConfig: {
                            typeName: event.target.value,
                            params: getVotingMachineDefaultParams(
                              event.target.value
                            ),
                          },
                        })
                      }}
                      value={
                        votingMachine != null ? votingMachine.typeName : ""
                      }
                      inputProps={{
                        name: "votingMachine",
                        id: "voting-machine",
                      }}
                    >
                      {R.map(votingMachine => {
                        return (
                          <MenuItem
                            key={`voting-machine-select-${
                              votingMachine.typeName
                            }`}
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
                  {this.stepControlls(
                    false,
                    false,
                    votingMachine != null,
                    classes
                  )}
                </StepContent>
              </Step>
              <Step>
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
                          onChange={this.handleVotingMachineParamsChange}
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
                  {this.stepControlls(false, true, true, classes)}
                </StepContent>
              </Step>
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
