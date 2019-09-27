import * as React from "react";
import {
  Grid,
  Fab,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  Button
} from "@material-ui/core";
import ImportIcon from "@material-ui/icons/Unarchive";
import { DAOForm } from "lib/forms";

interface ImportError {
  file: string;
  error: string;
}

interface Props {
  form: DAOForm;
  onImport: () => void;
}

interface State {
  open: boolean;
  error: ImportError | undefined;
}

const initState = {
  open: false,
  error: undefined
};

export default class MigrationParamsImport extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...initState
    };
  }

  render() {
    const { form, onImport } = this.props;
    const { open, error } = this.state;

    const onOpen = () => {
      this.setState({
        ...initState,
        open: true
      });
    };

    const onClose = () =>
      this.setState({
        ...initState,
        open: false
      });

    const onError = (file: string, error: string) =>
      this.setState({
        ...this.state,
        error: { file, error }
      });

    const onFilePicked = async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files === null) {
        return;
      }

      const files = Array.from(event.target.files);

      if (files.length === 0) {
        return;
      }

      const file: File = files[0];

      try {
        await form.fromMigrationParamsFile(file);
        await form.validate();
      } catch (e) {
        onError(file.name, e.message);
        return;
      }

      onClose();
      onImport();
    };

    const ImportInfo = () => (
      <DialogTitle id="simple-dialog-title">
        Import an existing `dao-params.json` file.
      </DialogTitle>
    );

    const ImportErrors = (props: { error: ImportError }) => (
      <DialogContent>
        <strong>We encountered an issue during the import process:</strong>
        <br />
        <div>
          {props.error.file}: {props.error.error}
        </div>
      </DialogContent>
    );

    const ImportButton = () => (
      <FormControl>
        <Button color="primary" variant="contained" component="label">
          Upload File
          <input
            type="file"
            id="file"
            accept=".json"
            multiple={false}
            onChange={onFilePicked}
            style={{ display: "none" }}
          />
        </Button>
      </FormControl>
    );

    return (
      <>
        <Grid item xs={12} md={7}>
          <Fab size={"small"} color={"primary"} onClick={onOpen}>
            <ImportIcon />
          </Fab>
        </Grid>
        <Dialog onClose={onClose} open={open}>
          {error ? <ImportErrors error={error} /> : <ImportInfo />}
          <ImportButton />
        </Dialog>
      </>
    );
  }
}
