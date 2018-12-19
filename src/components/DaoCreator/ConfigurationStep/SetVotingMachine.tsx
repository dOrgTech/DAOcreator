import * as R from "ramda"
import * as React from "react"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import {
  Card,
  Select,
  InputLabel,
  MenuItem,
  Checkbox,
  createStyles,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  Theme,
  withStyles,
  WithStyles,
  Typography,
} from "@material-ui/core"
import DaoCreatorActions, * as daoCreatorActions from "../../../redux/actions/daoCreator"
import {
  VotingMachine,
  votingMachines,
} from "../../../lib/integrations/daoStack/arc"
import { AppState } from "src/AppState";

interface Props extends WithStyles<typeof styles> {
  currentVotingMachine: VotingMachine
  actions: DaoCreatorActions
}

const SetVotingMachine: React.SFC<Props> = ({
  classes,
  currentVotingMachine,
    actions,
}) => {
  return (
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
                  key={`voting-machine-select-${votingMachine.typeName}`}
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
          {/* TODO fix styling of this */ currentVotingMachine.description}
        </Typography>
      </Paper>
    </FormControl>
  )
}

// STYLE
const styles = ({  }: Theme) =>
  createStyles({
    header: {},
    card: {},
    addButton: {},
    subheader: {},
    headline: {},
  })

const componentWithStyles = withStyles(styles)(SetVotingMachine)

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
