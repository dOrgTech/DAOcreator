import * as React from "react";
import { observer } from "mobx-react";
import {
  Select,
  FilledInput,
  FormControl,
  InputLabel,
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Button
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Settings";
import GenesisProtocolEditor from "./GenesisProtocolEditor";
import { GenesisProtocolForm } from "../../../lib/forms";
import { GenesisProtocolPreset } from "../../../lib/dependency/arc";

interface Props {
  form: GenesisProtocolForm;
  editable: boolean;
}

interface State {
  editing: boolean;
}

@observer
export default class GenesisProtocolPresetEditor extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editing: false
    };
  }

  render() {
    const { form, editable } = this.props;
    const { editing } = this.state;

    const onChange = (event: React.ChangeEvent<{ value: any }>) => {
      let value = event.target.value;

      if (value === "0") {
        value = undefined;
      }

      form.preset = value;
      this.forceUpdate();
    };

    const onEdit = () => {
      form.preset = undefined;
      this.setState({
        ...this.state,
        editing: true
      });
    };

    const onClose = async () => {
      const res = await this.props.form.validate();

      if (res.hasError) {
        return;
      }

      this.setState({
        ...this.state,
        editing: false
      });
    };

    // TODO: base class for all forms (move analytics into step, pass for into here)
    return (
      <>
        <FormControl variant="filled" fullWidth>
          <InputLabel htmlFor="protocol">Genesis Protocol</InputLabel>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={10}>
              <Select
                native
                fullWidth
                disabled={!editable}
                value={form.preset === undefined ? 0 : form.preset}
                onChange={onChange}
                input={<FilledInput name="protocol" id="protocol" />}
              >
                <option value={GenesisProtocolPreset.Easy}>Easy</option>
                <option value={GenesisProtocolPreset.Normal}>Normal</option>
                <option value={GenesisProtocolPreset.Critical}>Critical</option>
                <option value={0}>Custom</option>
              </Select>
            </Grid>
            <Grid item>
              <Fab
                disabled={!editable}
                size="small"
                color="secondary"
                onClick={onEdit}
              >
                <EditIcon />
              </Fab>
            </Grid>
            <Dialog
              open={editing}
              onClose={onClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Genesis Protocol</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  <div>
                    Genesis protocol is our implementation of holographic
                    consensus as a smart contract on the ethereum blockchain. In
                    order to allow various use cases, the genesis protocol has
                    several configurations parameters:
                  </div>
                </DialogContentText>
                <GenesisProtocolEditor form={form} editable={true} />
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose}>Save</Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </FormControl>
      </>
    );
  }
}
