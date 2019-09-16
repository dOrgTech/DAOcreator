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
import UploadIcon from "@material-ui/icons/CloudUpload";

interface ImportError {
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

class SettingsImport extends React.Component<Props, State> {
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
        ...initState,
        open: true
      });
    };

    const onClose = () =>
      this.setState({
        ...initState,
        open: false
      });

    const onError = () =>
      this.setState({
        ...this.state,
        error: {
          error:
            "Please make sure you are importing a existing dao-params.json file"
        }
      });

    const ImportInfo = () => (
      <DialogTitle id="simple-dialog-title">
        Import an existing dao-params.json file
      </DialogTitle>
    );

    const ImportErrors = (props: { error: ImportError }) => (
      <DialogContent>
        <strong>We encountered an issue during the import process:</strong>
        <br />
        <div>{props.error.error}</div>
      </DialogContent>
    );

    const importJSON = (event: React.ChangeEvent<HTMLInputElement>): void => {
      if (event.target.files === null) {
        return;
      }

      const target = event.target as HTMLInputElement;
      const file: File = target.files![0];
      handleFileChosen(file);
    };

    const handleFileChosen = (file: File) => {
      let fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = async () => {
        try {
          await updateForms(fileReader.result);
          sendToReviewStep();
        } catch (error) {
          onError();
          return;
        }
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
            <UploadIcon />
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

export default SettingsImport;
