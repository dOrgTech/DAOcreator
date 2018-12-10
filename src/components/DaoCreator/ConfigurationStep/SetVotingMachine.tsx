import {
  Card,
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
    <Card className={classes.card}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Select voting machine</FormLabel>
        <FormGroup>
          {R.map(votingMachine => {
            return (
              <FormControlLabel
                key={"formControlLable-" + votingMachine.name}
                control={
                  <Checkbox
                    checked={R.equals(
                      votingMachine.name,
                      currentVotingMachineParmas.name
                    )}
                    onChange={() => setVotingMachineParams(votingMachine)}
                    value={votingMachine.name}
                  />
                }
                label={votingMachine.name}
              />
            )
          }, avalibleVotingMachines)}
        </FormGroup>
      </FormControl>
    </Card>
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
    setVotingMachineParams: (votingMachineConfig: VotingMachinConfig) =>
      dispatch(setVotingMachine(votingMachineConfig)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
