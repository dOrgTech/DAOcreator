import * as React from "react";
import {
  Theme,
  createStyles,
  WithStyles,
  withStyles,
  Select,
  FilledInput,
  FormControl,
  InputLabel
} from "@material-ui/core";
import { GenesisProtocolForm } from "../../../lib/forms";

interface Props extends WithStyles<typeof styles> {
  onSelect: (genesisProtocol: GenesisProtocolForm) => void;
}

enum ProtocolPreset {
  empty = "",
  fast = "Fast",
  slow = "Slow",
  custom = "Custom"
}

interface State {
  protocol: ProtocolPreset;
}

class GenesisProtocolSelector extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      protocol: ProtocolPreset.empty
    };
  }

  render() {
    const { onSelect } = this.props;
    const { protocol } = this.state;

    const handleChange = (name: keyof State) => (
      event: React.ChangeEvent<{ value: any }>
    ) => {
      this.setState({
        ...this.state,
        [name]: event.target.value
      });
    };

    console.log(ProtocolPreset.fast);

    return (
      <FormControl variant="filled" fullWidth>
        <InputLabel htmlFor="protocol">Genesis Protocol</InputLabel>
        <Select
          native
          value={protocol}
          onChange={handleChange("protocol")}
          input={<FilledInput name="protocol" id="protocol" />}
        >
          <option value={ProtocolPreset.empty}>{ProtocolPreset.empty}</option>
          <option value={ProtocolPreset.fast}>{ProtocolPreset.fast}</option>
          <option value={ProtocolPreset.slow}>{ProtocolPreset.slow}</option>
          <option value={ProtocolPreset.custom}>{ProtocolPreset.custom}</option>
        </Select>
      </FormControl>
    );
  }
}

const styles = (theme: Theme) => createStyles({});

export default withStyles(styles)(GenesisProtocolSelector);
