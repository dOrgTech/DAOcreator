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
// import Papa from 'papaparse';
import { MembersForm, MemberForm } from "../../../lib/forms";
import { MembersCSVImportState } from "../../../lib/state";

interface Props {
  form: MembersForm;
}

export default class MembersCSVImport extends React.Component<
  Props,
  MembersCSVImportState
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openDialog: false,
      files: []
    };
    this.handleFileRead = this.handleFileRead.bind(this);
    this.importCSV = this.importCSV.bind(this);
  }

  public handleDialogClose(): void {
    this.setState({ openDialog: false });
  }

  public importCSV(event: React.ChangeEvent): void {
    const target = event.target as HTMLInputElement;
    const files: File[] = Array.from(target.files as FileList);
    this.setState({ files });
    const handleFiles = (file: File) => {
      this.handleFileChosen(file);
    };
    files.map(handleFiles);
  }

  public handleFileChosen(file: File): void {
    let fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = () => {
      this.handleFileRead(fileReader);
    };
  }

  private handleFileRead(file: any): void {
    let csv: any = file.result;
    const parseCSV = (error: any, members: MemberForm[]) => {
      const addMembers = (member: any) => {
        return new Promise<MemberForm>(resolve => {
          let newMember: MemberForm = new MemberForm(
            this.props.form.getDAOTokenSymbol
          );
          newMember.$.address.value = member.address;
          newMember.$.reputation.value = member.reputation;
          newMember.$.tokens.value = member.tokens;
          resolve(newMember);
        });
      };

      const membersPromises = members.map(addMembers);
      Promise.all(membersPromises).then(resolvedMembers => {
        for (const addMember of resolvedMembers) {
          this.props.form.$.push(addMember);
        }
      });

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
            Make sure your CSV file has the following columns:
            <li>Address</li>
            <li>Reputation</li>
            <li>Tokens</li>
          </DialogTitle>
          <FormControl>
            <Button variant="contained" component="label">
              Upload File
              <input
                type="file"
                id="file"
                accept=".csv"
                multiple={true}
                onChange={this.importCSV}
                style={{ display: "none" }}
              />
            </Button>
          </FormControl>
        </Dialog>
      </>
    );
  }
}
