import * as React from "react";
import {
  Fab,
  FormControl,
  Dialog,
  DialogTitle,
  Button
} from "@material-ui/core";
import { AttachFile } from "@material-ui/icons";
import parse from "csv-parse";
import { MembersForm, MemberForm } from "../../../lib/forms";
import { MembersCSVImportState } from "../../../lib/state";

interface Props {
  form: MembersForm;
}

export default class MembersCSVImport extends React.Component<
  Props,
  MembersCSVImportState
> {
  private fileReader: FileReader;
  constructor(props: Props) {
    super(props);
    this.state = {
      openDialog: false
    };
    this.fileReader = new FileReader();
    this.handleFileRead = this.handleFileRead.bind(this);
  }

  public handleDialogClose(): void {
    this.setState({ openDialog: false });
  }

  public handleFileChosen(file: any): void {
    this.fileReader.onloadend = this.handleFileRead;
    this.fileReader.readAsText(file);
  }

  private handleFileRead(): void {
    const csv: any = this.fileReader.result;
    const parseCSV = (error: any, members: MemberForm[]) => {
      const addMembers = (member: any) => {
        let newMember = new MemberForm(this.props.form.getDAOTokenSymbol);
        newMember.$.address.value = member.address;
        newMember.$.reputation.value = member.reputation;
        newMember.$.tokens.value = member.tokens;
        this.props.form.$.push(newMember);
      };
      members.map(addMembers);
      this.handleDialogClose();
      if (error) {
        console.log("error", error);
      }
    };
    const parseCSVOptions = {
      columns: true
    };
    parse(csv, parseCSVOptions, parseCSV);
  }

  render() {
    const { openDialog } = this.state;
    return (
      <>
        <Fab
          size={"small"}
          color={"primary"}
          onClick={async () => {
            this.setState({
              openDialog: true
            });
          }}
        >
          <AttachFile />
        </Fab>
        <Dialog onClose={() => this.handleDialogClose()} open={openDialog}>
          <DialogTitle id="simple-dialog-title">
            Make sure CSV is properly formatted
          </DialogTitle>
          <FormControl>
            <Button variant="contained" component="label">
              Upload File
              <input
                type="file"
                id="file"
                accept=".csv"
                onChange={event => {
                  this.handleFileChosen(event.target.files![0]);
                }}
                style={{ display: "none" }}
              />
            </Button>
          </FormControl>
        </Dialog>
      </>
    );
  }
}
