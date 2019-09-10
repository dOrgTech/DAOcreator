import * as React from "react";
import {
  Grid,
  Fab,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  Button
} from "@material-ui/core"; // import { DAOConfig } from "lib/state";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
interface ImportError {
  file: string;
  error: string;
}

interface State {
  open: boolean;
  error: ImportError | undefined;
}

interface Props {
  sendToReviewStep: any;
  updateForms: any;
}

const initState = {
  open: false,
  error: undefined
};

export default class SettingsImport extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...initState
    };
  }
  render() {
    const { sendToReviewStep, updateForms } = this.props;
    const { open, error } = this.state;
    const onOpen = () => {
      this.setState({
        open: true
      });
    };

    const ImportInfo = () => (
      <DialogTitle id="simple-dialog-title">
        Make sure your JSON works
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

    const importJSON = (event: React.ChangeEvent<HTMLInputElement>): void => {
      if (event.target.files === null) {
        return;
      }

      const target = event.target as HTMLInputElement;
      const file: File = target.files![0];
      handleFileChosen(file);

      this.setState({
        open: false
      });
    };

    const handleFileChosen = (file: File): void => {
      let fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        updateForms(fileReader.result);
        sendToReviewStep();
      };
    };

    const ImportButton = () => (
      <FormControl>
        <Button variant="contained" component="label">
          Upload File
          <input
            type="file"
            id="file"
            accept=".json"
            onChange={importJSON}
            style={{ display: "none" }}
          />
        </Button>
      </FormControl>
    );

    return (
      <>
        <Grid item xs={12} md={7}>
          <Fab size={"small"} color={"primary"} onClick={onOpen}>
            <CloudUploadIcon />
          </Fab>
        </Grid>
        <Dialog open={open}>
          {error ? <ImportErrors error={error} /> : <ImportInfo />}
          <ImportButton />
        </Dialog>
      </>
    );
  }
}
