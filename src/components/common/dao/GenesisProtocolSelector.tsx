import * as React from "react";
import { observable } from "mobx";
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
import {
  GenesisProtocolForm,
  CreateGenesisProtocolForm
} from "../../../lib/forms";
import { GenesisProtocol } from "../../../lib/dependency/arc";

interface Props extends WithStyles<typeof styles> {
  onSelect: (genesisProtocol: GenesisProtocolForm) => void;
}

export enum ProtocolPreset {
  easy = "Easy",
  normal = "Normal",
  critical = "Critical",
  custom = "Custom"
}

interface State {
  protocol: ProtocolPreset;
}

class GenesisProtocolSelector extends React.Component<Props, State> {
  @observable
  form = CreateGenesisProtocolForm();

  constructor(props: Props) {
    super(props);
    this.state = {
      protocol: ProtocolPreset.normal
    };
  }

  render() {
    const { onSelect } = this.props;
    const { protocol } = this.state;
    const form = this.form;

    const onChange = (event: React.ChangeEvent<{ value: any }>) => {
      const preset = event.target.value as ProtocolPreset;

      // update the backing form to a preset if needed
      switch (preset) {
        case ProtocolPreset.easy:
          form.fromState(GenesisProtocol.EasyConfig);
          break;
        case ProtocolPreset.normal:
          form.fromState(GenesisProtocol.NormalConfig);
          break;
        case ProtocolPreset.critical:
          form.fromState(GenesisProtocol.CriticalConfig);
          break;
      }

      // let the parent know something's been chosen
      onSelect(form);

      this.setState({
        protocol: preset
      });
    };

    // TODO: <GenesisProtocolAnalytics protocol{form.toState()} />
    return (
      <FormControl variant="filled" fullWidth>
        <InputLabel htmlFor="protocol">Genesis Protocol</InputLabel>
        <Select
          native
          value={protocol}
          onChange={onChange}
          input={<FilledInput name="protocol" id="protocol" />}
        >
          <option value={ProtocolPreset.easy}>{ProtocolPreset.easy}</option>
          <option value={ProtocolPreset.normal}>{ProtocolPreset.normal}</option>
          <option value={ProtocolPreset.critical}>
            {ProtocolPreset.critical}
          </option>
          <option value={ProtocolPreset.custom}>{ProtocolPreset.custom}</option>
        </Select>
      </FormControl>
    );
  }
}

const styles = (theme: Theme) => createStyles({});

export default withStyles(styles)(GenesisProtocolSelector);
