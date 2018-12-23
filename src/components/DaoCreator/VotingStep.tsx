import {
  TextField,
  Card,
  CardContent,
  createStyles,
  FormControl,
  FormGroup,
  FormLabel,
  Grid,
  MenuItem,
  Paper,
  Select,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core"
import * as R from "ramda"
import * as React from "react"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import { AppState } from "src/AppState"
import {
  VotingMachine,
  votingMachines,
  VotingMachineConfiguration,
} from "../../lib/integrations/daoStack/arc"
import DaoCreatorActions, * as daoCreatorActions from "../../redux/actions/daoCreator"

interface Props extends WithStyles<typeof styles> {
  currentVotingMachineConfiguration: VotingMachineConfiguration
  actions: DaoCreatorActions
}

type State = {
  formErrors: {}
}

const initState: State = {
  formErrors: {},
}

class VotingStep extends React.Component<Props, State> {
  state: Readonly<State> = initState
  handleChange = async (event: any) => {
    const { name, value } = event.target

    await this.setState({
      [name]: value,
    } as any)
  }

  render() {
    const { classes, currentVotingMachineConfiguration, actions } = this.props
    const currentVotingMachine = R.find(
      votingMachine =>
        votingMachine.typeName === currentVotingMachineConfiguration.typeName,
      votingMachines
    ) as VotingMachine
      console.log("1:")
      console.log(currentVotingMachine)

    return (
      <Card className={classes.card}>
        <form>
          <CardContent>
            <Typography variant="h4" className={classes.headline} gutterBottom>
              Voting Configurations
            </Typography>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <Typography gutterBottom>
                  Select and configurate voting machine
                </Typography>
                <FormControl>
                  <FormLabel>Voting Machine</FormLabel>
                  <FormGroup>
                    <FormControl>
                      <Select
                        onChange={(event: any) =>
                          actions.setVotingMachine({
                            typeName:
                              event.target.value,
                            params: R.omit(["formErrors"], this.state),
                          })
                        }
                        value={currentVotingMachine.typeName}
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
                        }, votingMachines)}
                      </Select>
                    </FormControl>
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                {R.map(
                  param => (
                    <Grid item xs={6} key={`text-field-${param.typeName}`}>
                      <TextField
                        name={param.typeName}
                        label={param.displayName}
                        margin="normal"
                        onChange={this.handleChange}
                        value={R.pathOr(
                          param.defaultValue,
                          [param.typeName],
                          this.state
                        )}
                        fullWidth
                        error={
                          !R.isEmpty(this.state.formErrors[param.typeName])
                        }
                        helperText={this.state.formErrors[param.typeName]}
                        required
                      />
                      <Typography gutterBottom>
                        <i>{param.description}</i>
                      </Typography>
                    </Grid>
                  ),
                  currentVotingMachine.params
                )}
              </Grid>
            </Grid>
          </CardContent>
        </form>
      </Card>
    )
  }
}

// STYLE
const styles = ({  }: Theme) =>
  createStyles({
    card: {},
    headline: {},
    daoName: {},
    tokenName: {},
    tokenSymbol: {},
  })

const componentWithStyles = withStyles(styles)(VotingStep)

// STATE
const mapStateToProps = (state: AppState) => {
  return {
      currentVotingMachineConfiguration: state.daoCreator.votingMachineConfiguration,
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
