import * as R from "ramda"
import {
  createStyles,
  Typography,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Dialog,
  DialogTitle,
  Theme,
  withStyles,
  WithStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core"
import * as React from "react"
import {
  VotingMachine,
  votingMachines,
  VotingMachineConfiguration,
  Scheme,
  schemes,
} from "../../../../lib/integrations/daoStack/arc"
import ConfigureScheme from "./ConfigureScheme"

interface Props extends WithStyles<typeof styles> {
  open: boolean
  addScheme: (
    schemeType: string,
    votingMachineConfig: VotingMachineConfiguration
  ) => void
  close: () => void
}

interface State {
  schemeTypeName: string
  votingMachineConfig: VotingMachineConfiguration | undefined
}

class AddSchemeDialog extends React.Component<Props, State> {
  public readonly state: State = {
    schemeTypeName: "",
    votingMachineConfig: undefined,
  }

  setScheme = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ schemeTypeName: event.target.value })
  }

  resetDialog = () => {
    this.setState({
      schemeTypeName: "",
      votingMachineConfig: undefined,
    })
  }

  updateSchemeConfig = (
    schemeTypeName: string,
    votingMachineConfig: VotingMachineConfiguration
  ) => {
    console.log(schemeTypeName)
    console.log(votingMachineConfig)
    this.setState({
      schemeTypeName,
      votingMachineConfig,
    })
  }

  handleSave = () => {
    const { schemeTypeName, votingMachineConfig } = this.state
    if (!R.isEmpty(schemeTypeName) && votingMachineConfig != null) {
      this.props.addScheme(schemeTypeName, votingMachineConfig)
      this.handleClose()
    } else {
      throw Error(
        "There is a bug; it should not be possible to call 'handleSave' when 'schemeType' and/or 'votingMAchineCinfig' are undefined"
      )
    }
  }

  handleClose = () => {
    this.props.close()
    this.resetDialog()
  }

  render() {
    const { open, classes } = this.props

    return (
      <Dialog open={open}>
        <DialogTitle>Select Scheme</DialogTitle>
        <DialogContent>
          <DialogContentText>Select a Scheme to add</DialogContentText>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="scheme-select">Scheme</InputLabel>
            <Select
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
          {R.isEmpty(this.state.schemeTypeName) ? null : (
            <ConfigureScheme
              updateScheme={this.updateSchemeConfig}
              schemeTypeName={this.state.schemeTypeName}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

// STYLE
const styles = (theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 120,
    },
  })

export default withStyles(styles)(AddSchemeDialog)
