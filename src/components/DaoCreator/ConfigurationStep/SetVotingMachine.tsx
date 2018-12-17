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
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core"
import * as R from "ramda"
import * as React from "react"
import { connect } from "react-redux"
import { setVotingMachine } from "../../../state/actions/daoCreator"

interface Props extends WithStyles<typeof styles> {
  setVotingMachineParams: (params: VotingMachinConfig) => void
  currentVotingMachineParmas: VotingMachinConfig
  avalibleVotingMachines: VotingMachinConfig[]
}

const SetVotingMachine: React.SFC<Props> = ({
  classes,
  setVotingMachineParams,
  currentVotingMachineParmas,
  avalibleVotingMachines,
}) => {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Select voting machine</FormLabel>
      <FormGroup>
        <FormControl>
          <InputLabel htmlFor="voting-machine">Voting Machine</InputLabel>
          <Select
            onChange={(event: any) =>
              setVotingMachineParams(R.find(
                votingMachine => votingMachine.name === event.target.value,
                avalibleVotingMachines
              ) as any)
            }
            value={currentVotingMachineParmas.name}
            inputProps={{
              name: "votingMachin",
              id: "voting-machine",
            }}
          >
            {R.map(votingMachine => {
              return (
                <MenuItem
                  key={`voting-machine-select-${votingMachine.name}`}
                  value={votingMachine.name}
                >
                  {votingMachine.name}
                </MenuItem>
              )
            }, avalibleVotingMachines)}
          </Select>
        </FormControl>
      </FormGroup>
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
const mapStateToProps = (state: any) => {
  return {
    // TODO: fix hardcoded
    avalibleVotingMachines: [
      { name: "GenesisProtocol" },
      { name: "AbsoluteVote" },
    ],
    currentVotingMachineParmas: state.daoCreator.votingMachine,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setVotingMachineParams: (votingMachineConfig: VotingMachinConfig) => {
      console.log(votingMachineConfig)
      return dispatch(setVotingMachine(votingMachineConfig))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
