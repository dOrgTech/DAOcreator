import {
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
} from "../../lib/integrations/daoStack/arc"
import DaoCreatorActions, * as daoCreatorActions from "../../redux/actions/daoCreator"

interface Props extends WithStyles<typeof styles> {
  currentVotingMachine: VotingMachine
  actions: DaoCreatorActions
}

type State = {
  formErrors: {}
}

class VotingStep extends React.Component<Props, State> {
  handleChange = async (event: any) => {
    const { name, value } = event.target

    await this.setState({
      [name]: value,
    } as any)
  }

  render() {
    const { classes, currentVotingMachine, actions } = this.props

    return (
      <Card className={classes.card}>
        <form>
          <CardContent>
            <Typography variant="h4" className={classes.headline} gutterBottom>
              Create a DAO
            </Typography>
            <Grid container spacing={16}>
              <Grid item xs={12} md={6}>
                <FormControl>
                  <FormLabel>Voting Machine</FormLabel>
                  <FormGroup>
                    <FormControl>
                      <Select
                        onChange={(event: any) =>
                          actions.setVotingMachine(R.find(
                            votingMachine =>
                              votingMachine.displayName === event.target.value,
                            votingMachines
                          ) as any)
                        }
                        value={currentVotingMachine.displayName}
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
                              value={votingMachine.displayName}
                            >
                              {votingMachine.displayName}
                            </MenuItem>
                          )
                        }, votingMachines)}
                      </Select>
                    </FormControl>
                  </FormGroup>
                  <Paper>
                    <Typography>
                      {
                        /* TODO fix styling of this */ currentVotingMachine.description
                      }
                    </Typography>
                  </Paper>
                </FormControl>
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
    currentVotingMachine: state.daoCreator.votingMachine,
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
