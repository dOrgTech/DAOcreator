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
import { RootState } from "../../../state"
import {
  VotingMachine,
  votingMachines,
  VotingMachineConfiguration,
} from "../../../lib/integrations/daoStack/arc"
import DAOcreatorActions, * as daoCreatorActions from "../../../redux/actions/daoCreator"

interface Props extends WithStyles<typeof styles> {
  currentVotingMachineConfiguration: VotingMachineConfiguration
  actions: DAOcreatorActions
}

type State = {
  formErrors: {}
}

const initState: State = {
  // TODO: this doesn't have a type, and isn't being used...
  //       this can be fixed with a generalized form component
  // - pass in array of { name, type, desc, errTxt, onchange, drawOverride? }
  //   - just use the forms package instead?
  // - fix the types first though, then work on the forms
  formErrors: {},
}

const getVotingMachineDefaultParams = (typeName: string): any => {
  const votingMachine = R.find(
    votingMachine => votingMachine.typeName === typeName,
    votingMachines
  ) as VotingMachine

  return R.reduce(
    (acc, param) => R.assoc(param.typeName, param.defaultValue, acc),
    {},
    votingMachine.params
  )
}

class VotingStep extends React.Component<Props, State> {
  public readonly state: State = {
    ...initState,
    ...getVotingMachineDefaultParams(
      this.props.currentVotingMachineConfiguration.typeName
    ),
  }

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

    return (
      <Card className={classes.card}>
        <form>
          <CardContent>
            <Typography variant="h4" className={classes.headline} gutterBottom>
              Configure Voting
            </Typography>
            <Grid container spacing={16}>
              <Grid item xs={12} md={5}>
                <Typography className={classes.guideText} variant="body2">
                  What type of voting should the DAO support? Votes are used to
                  form consensus on proposals, determining if they will pass or
                  fail. <br />
                  <br />
                  Select different voting mechanism to learn more.
                </Typography>
              </Grid>
              <Grid item xs={12} md={7}>
                <Grid item xs={12} md={7}>
                  <FormControl>
                    <FormGroup>
                      <FormControl>
                        <Select
                          onChange={async (event: any) => {
                            await this.setState(
                              getVotingMachineDefaultParams(event.target.value)
                            )

                            actions.setVotingMachine({
                              typeName: event.target.value,
                              params: R.omit(["formErrors"], this.state),
                            })
                          }}
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
                <Grid item xs={12}>
                  <Typography
                    gutterBottom
                    className={classes.votingMachineDescription}
                  >
                    {currentVotingMachine.description}
                  </Typography>
                  <Typography variant="h6">Configuration parameters</Typography>
                  {R.map(
                    param => (
                      <Grid item xs={12} key={`text-field-${param.typeName}`}>
                        <TextField
                          name={param.typeName}
                          label={param.displayName}
                          margin="normal"
                          onChange={this.handleChange}
                          value={R.prop(param.typeName, this.state as any)}
                          onBlur={() =>
                            actions.setVotingMachine({
                              typeName: currentVotingMachine.typeName,
                              params: R.omit(["formErrors"], this.state),
                            })
                          }
                          fullWidth
                          error={
                            R.has(param.typeName, this.state.formErrors) &&
                            !R.isEmpty(
                              R.prop(param.typeName, this.state
                                .formErrors as any)
                            )
                          }
                          helperText={R.prop(param.typeName, this.state
                            .formErrors as any)}
                          required={!R.pathOr(false, ["optional"], param)}
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
    votingMachineDescription: {
      marginBottom: 25,
      fontSize: 16,
    },
    guideText: {
      fontSize: 18,
      maxWidth: 450,
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop: 50,
      paddingBottom: 50,
      margin: "auto",
    },
  })

const componentWithStyles = withStyles(styles)(VotingStep)

// STATE
const mapStateToProps = (state: RootState) => {
  return {
    currentVotingMachineConfiguration:
      state.daoCreator.votingMachineConfiguration,
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
