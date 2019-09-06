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
    const { sendToReviewStep } = this.props;
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

    const onImport = (event: React.ChangeEvent<HTMLInputElement>) => {
      // this.setState({
      // 	open: false
      // })
      sendToReviewStep();
    };

    const ImportButton = () => (
      <FormControl>
        <Button variant="contained" component="label">
          Upload File
          <input
            type="file"
            id="file"
            accept=".json"
            onChange={() => sendToReviewStep()}
            style={{ display: "none" }}
          />
        </Button>
      </FormControl>
    );

    return (
      <>
        <Grid item xs={12} md={7}>
          <Fab size={"small"} color={"primary"} onClick={onOpen}>
            Go to review
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
