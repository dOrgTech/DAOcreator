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

const INITIAL_STATE = {
  openDialog: false,
  files: [],
  csvFormat: {
    hasError: false,
    filenames: [],
    errorMessage: null,
    errorMessages: []
  }
};

export default class MembersCSVImport extends React.Component<
  Props,
  MembersCSVImportState
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };
    this.handleFileRead = this.handleFileRead.bind(this);
    this.importCSV = this.importCSV.bind(this);
    this.importCSVClick = this.importCSVClick.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  public handleDialogClose(): void {
    this.setState({ ...INITIAL_STATE });
  }

  public importCSVClick(event: React.MouseEvent) {
    // Need to this so we can select same file again and again for testing.
    // Also reset messages in Dialog.
    const element = event.target as HTMLInputElement;
    element.value = "";
    this.clearCSVFormat();
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

  private handleFileChosen(file: File): void {
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = () => {
      this.handleFileRead(fileReader, file.name);
    };
  }

  private handleFileRead(file: FileReader, filename: string): void {
    const csv: any = file.result;
    const parseCSVOptions = {
      columns: true
    };
    const parseCSV = (error: Error | undefined, members: MemberForm[]) => {
      const csvColumns = Object.keys(members[0]);
      if (this.isCSVImportValid(csvColumns)) {
        this.CSVImportAddMembers(members, filename);
      } else {
        const csvFormat = {
          ...this.state.csvFormat,
          hasError: true,
          filenames: [...this.state.csvFormat.filenames, filename],
          errorMessage: "FileCSVColumnsIssue"
        };
        this.setState({ csvFormat });
      }
      if (error) {
        console.log("error", error);
      }
    };

    parse(csv, parseCSVOptions, parseCSV);
  }

  private CSVImportAddMembers(members: MemberForm[], filename: string): void {
    const addMembers = (member: any) => {
      const memberResolver = (resolve: any) => {
        let newMember: MemberForm = new MemberForm(
          this.props.form.getDAOTokenSymbol
        );
        newMember.$.address.value = member.address;
        newMember.$.reputation.value = member.reputation;
        newMember.$.tokens.value = member.tokens;
        resolve(newMember);
      };
      const memberPromise = new Promise<MemberForm>(memberResolver);
      return memberPromise;
    };
    const membersPromises = members.map(addMembers);

    let csvLineIndex: number = 1;
    let addMemberErrors: string[] = [];
    const resolvedMembers = async (resolvedMembers: MemberForm[]) => {
      for (const addMember of resolvedMembers) {
        this.props.form.$.push(addMember);
        csvLineIndex += 1;
        const memberValidate = await this.props.form.validate();
        this.setState({
          csvFormat: {
            ...this.state.csvFormat,
            hasError: memberValidate.hasError
          }
        });
        if (memberValidate.hasError) {
          const errorMessage = `${this.props.form.error}. Check line ${csvLineIndex} in file ${filename}`;
          addMemberErrors.push(errorMessage);
          this.setState((state: MembersCSVImportState) => {
            const csvFormat = {
              ...state.csvFormat,
              errorMessage: addMemberErrors[0],
              errorMessages: [...state.csvFormat.errorMessages, errorMessage]
            };
            return { csvFormat };
          });
          this.props.form.$.pop();
        } else {
          console.log("no error uploading csv");
        }
      }
    };
    if (!(this.state.csvFormat.errorMessage === "FileCSVColumnsIssue")) {
      Promise.all(membersPromises)
        .then(resolvedMembers)
        .then(() => {
          if (this.state.csvFormat.errorMessages.length > 0) {
            this.setState({
              csvFormat: {
                ...this.state.csvFormat,
                hasError: true,
                errorMessages: addMemberErrors
              }
            });
            // remove all entries if there is an error.
            for (
              let index = 0;
              index < membersPromises.length - addMemberErrors.length;
              index++
            ) {
              this.props.form.$.pop();
            }
          }
          if (!this.state.csvFormat.hasError) {
            this.handleDialogClose();
          }
        });
    }
  }

  private isCSVImportValid(csvColumns: Array<string>): boolean {
    const checkForThreeColumns = csvColumns.length === 3;
    const checkForOrderOfColumns =
      csvColumns[0] === "address" &&
      csvColumns[1] === "reputation" &&
      csvColumns[2] === "tokens";
    return checkForOrderOfColumns && checkForThreeColumns;
  }

  private clearCSVFormat(): void {
    this.setState({
      csvFormat: {
        ...INITIAL_STATE.csvFormat
      }
    });
  }

  private renderFab() {
    return (
      <Fab
        size={"small"}
        color={"primary"}
        onClick={async () => {
          this.setState({
            openDialog: true,
            csvFormat: {
              ...INITIAL_STATE.csvFormat
            }
          });
        }}
      >
        <AttachFile />
      </Fab>
    );
  }

  private renderDialog(openDialog: boolean) {
    return (
      <Dialog onClose={this.handleDialogClose} open={openDialog}>
        {this.renderDialogContent()}
        {this.renderFormControl()}
      </Dialog>
    );
  }

  private renderDialogContent() {
    if (this.state.csvFormat.hasError) {
      return (
        <DialogContent>
          {this.state.csvFormat.errorMessage === "FileCSVColumnsIssue" ? (
            <p>
              There has been an error uploading one or more of your csv files.
              Make sure proper formatting is set on each csv file columns. ie:
              make sure the first line of each csv file looks exactly like this:
              "address,reputation,tokens"
              <br />
              <strong>An issue has been found in the following files:</strong>
              {this.state.csvFormat.filenames.map(
                (filename: string, index: number) => (
                  <li key={index}>{filename}</li>
                )
              )}
            </p>
          ) : (
            <p>
              <strong>
                We found one or more issues trying to add members uploaded via
                csv files.
              </strong>
              <br />
              {this.state.csvFormat.errorMessages.map(
                (errorMessage: string, index: number) => (
                  <li key={index}> {errorMessage} </li>
                )
              )}
            </p>
          )}
        </DialogContent>
      );
    } else {
      return (
        <DialogTitle id="simple-dialog-title">
          Make sure your CSV file has the following columns:
          <ul>
            <li>Address</li>
            <li>Reputation</li>
            <li>Tokens</li>
          </ul>
        </DialogTitle>
      );
    }
  }

  private renderFormControl() {
    return (
      <FormControl>
        <Button variant="contained" component="label">
          Upload File
          <input
            type="file"
            id="file"
            accept=".csv"
            multiple={true}
            onChange={this.importCSV}
            onClick={this.importCSVClick}
            style={{ display: "none" }}
          />
        </Button>
      </FormControl>
    );
  }

  render() {
    const { openDialog } = this.state;
    return (
      <>
        {this.renderFab()}
        {this.renderDialog(openDialog)}
      </>
    );
  }
}
