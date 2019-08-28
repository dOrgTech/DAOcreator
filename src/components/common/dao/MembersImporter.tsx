import * as React from "react";
import {
  Fab,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  Button
} from "@material-ui/core";
import ImportIcon from "@material-ui/icons/AttachFile";
import { MembersForm } from "../../../lib/forms";

interface ImportError {
  file: string;
  error: string;
}

interface Props {
  form: MembersForm;
  membersAdded: () => void;
}

interface State {
  open: boolean;
  error: ImportError | undefined;
}

const initState = {
  open: false,
  error: undefined
};

export default class MembersImporter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...initState
    };
  }

  render() {
    const { form, membersAdded } = this.props;
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

    const onImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

      form.$ = [...formClone.$];
      membersAdded();
      onClose();
    };

    const ImportInfo = () => (
      <DialogTitle id="simple-dialog-title">
        Make sure your CSV file has the following columns:
        <ul>
          <li>address</li>
          <li>reputation</li>
          <li>tokens</li>
        </ul>
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
        <Button variant="contained" component="label">
          Upload File
          <input
            type="file"
            id="file"
            accept=".csv"
            multiple={true}
            onChange={onImport}
            style={{ display: "none" }}
          />
        </Button>
      </FormControl>
    );

    return (
      <>
        <Fab size={"small"} color={"primary"} onClick={onOpen}>
          <ImportIcon />
        </Fab>
        <Dialog onClose={onClose} open={open}>
          {error ? <ImportErrors error={error} /> : <ImportInfo />}
          <ImportButton />
        </Dialog>
      </>
    );
  }
}
