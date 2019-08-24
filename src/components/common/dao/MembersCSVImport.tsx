import * as React from "react";
import {
  Fab,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
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
  constructor(props: Props) {
    super(props);
    this.state = {
      openDialog: false,
      files: [],
      csvError: false
    };
    this.handleFileRead = this.handleFileRead.bind(this);
    this.importCSV = this.importCSV.bind(this);
  }

  public handleDialogClose(): void {
    this.setState({ openDialog: false, csvError: false });
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

  private handleFileRead(file: FileReader): void {
    let csv: any = file.result;
    const parseCSV = (error: Error | undefined, members: MemberForm[]) => {
      const csvColumns = Object.keys(members[0]);
      if (this.isCSVImportValid(csvColumns)) {
        const addMembers = (member: any) => {
          const memberPromise = new Promise<MemberForm>(resolve => {
            let newMember: MemberForm = new MemberForm(
              this.props.form.getDAOTokenSymbol
            );
            newMember.$.address.value = member.address;
            newMember.$.reputation.value = member.reputation;
            newMember.$.tokens.value = member.tokens;
            resolve(newMember);
          });
          return memberPromise;
        };

        const membersPromises = members.map(addMembers);
        Promise.all(membersPromises).then(resolvedMembers => {
          for (const addMember of resolvedMembers) {
            this.props.form.$.push(addMember);
          }
        });
        this.handleDialogClose();
      } else {
        console.log("csv format is bad");
        this.setState({
          csvError: true
        });
      }
      if (error) {
        console.log("error", error);
      }
    };
    const parseCSVOptions = {
      columns: true
    };

    parse(csv, parseCSVOptions, parseCSV);
  }

  private isCSVImportValid(csvColumns: Array<string>): boolean {
    const checkForThreeColumns = csvColumns.length === 3;
    const checkForOrderOfColumns =
      csvColumns[0] === "address" &&
      csvColumns[1] === "reputation" &&
      csvColumns[2] === "tokens";
    return checkForOrderOfColumns && checkForThreeColumns;
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
          {this.state.csvError ? (
            <DialogContent>
              <strong>
                There has been an error uploading one or more of your csv files.
                Make sure proper formatting is set on each cvs file columns. ie:
                make sure the first line of each csv file looks exactly like
                this: "address,reputation,tokens"
              </strong>
            </DialogContent>
          ) : (
            <DialogTitle id="simple-dialog-title">
              Make sure your CSV file has the following columns:
              <ul>
                <li>Address</li>
                <li>Reputation</li>
                <li>Tokens</li>
              </ul>
            </DialogTitle>
          )}
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
