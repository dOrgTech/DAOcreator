import * as React from "react";
import {
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  ButtonGroup,
  Grid
} from "@material-ui/core";
import DownloadIcon from "@material-ui/icons/Archive";
import ImportIcon from "@material-ui/icons/Unarchive";
import { MembersForm } from "@dorgtech/daocreator-lib";
import { saveAs } from "file-saver";

interface ImportError {
  file: string;
  error: string;
}

interface Props {
  form: MembersForm;
  onImport: () => void;
}

interface State {
  open: boolean;
  error: ImportError | undefined;
}

const initState: State = {
  open: false,
  error: undefined
};

export default class MembersSaveLoad extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...initState
    };
  }

  render() {
    const { form, onImport } = this.props;
    const { open, error } = this.state;

    const onOpen = () =>
      this.setState({
        ...initState,
        open: true
      });

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
      const formClone = new MembersForm(form.getDAOTokenSymbol);
      formClone.$ = [...form.$];

      for (const file of files) {
        const importedMembers = new MembersForm(form.getDAOTokenSymbol);

        try {
          await importedMembers.fromCSV(file);
        } catch (e) {
          onError(file.name, e.message);
          return;
        }

        // Try adding these members to the full list
        formClone.$ = [...formClone.$, ...importedMembers.$];

        await formClone.validate();
        if (formClone.hasError && formClone.error) {
          onError(file.name, formClone.error);
          return;
        }
      }

      form.$.splice(0, form.$.length);
      form.$.push(...formClone.$);

      onImport();
      onClose();
    };

    const onDownload = async () => {
      saveAs(new File([await form.toCSV()], "dao-members.csv"));
    };

    const onDownloadTemplate = async () => {
      const emptyForm = new MembersForm(form.getDAOTokenSymbol);
      saveAs(new File([await emptyForm.toCSV()], "dao-members.csv"));
    };

    const ImportInfo = () => (
      <DialogTitle id="simple-dialog-title">
        Make sure your CSV file has the following columns:
        <Grid
          container
          direction={"row"}
          justify={"space-around"}
          alignItems={"center"}
        >
          <Grid item>
            <ul>
              <li>address</li>
              <li>reputation</li>
              <li>tokens</li>
            </ul>
          </Grid>
          <Grid item>
            Need a template?
            <Grid container justify={"center"}>
              <Button
                onClick={onDownloadTemplate}
                size={"small"}
                color={"primary"}
                variant={"contained"}
              >
                <DownloadIcon />
              </Button>
            </Grid>
          </Grid>
        </Grid>
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
            accept=".csv"
            multiple={true}
            onChange={onFilePicked}
            style={{ display: "none" }}
          />
        </Button>
      </FormControl>
    );

    return (
      <ButtonGroup size={"small"} color={"primary"} variant={"contained"}>
        <Button onClick={onDownload}>
          <DownloadIcon />
        </Button>
        <Button onClick={onOpen}>
          <ImportIcon />
        </Button>
        <Dialog onClose={onClose} open={open}>
          {error ? <ImportErrors error={error} /> : <ImportInfo />}
          <ImportButton />
        </Dialog>
      </ButtonGroup>
    );
  }
}
