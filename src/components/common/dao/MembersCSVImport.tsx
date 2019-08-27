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

interface Props {
  form: MembersForm;
}

interface State {
  openDialog: boolean;
  files: File[];
  result: ImportResult;
}

interface ImportResult {
  hasError: boolean;
  filenames: string[];
  errorMessage: string | null;
  errorMessages: string[];
}

const initState = {
  openDialog: false,
  files: [],
  result: {
    hasError: false,
    filenames: [],
    errorMessage: null,
    errorMessages: []
  }
};

export default class MembersCSVImport extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...initState
    };

    this.handleFileRead = this.handleFileRead.bind(this);
    this.importCSV = this.importCSV.bind(this);
    this.importCSVClick = this.importCSVClick.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  public handleDialogClose(): void {
    this.setState({ ...initState });
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
    const csv = file.result as any;
    const parseCSVOptions = { columns: true };

    const parseCSV = (error: Error | undefined, members: MemberForm[]) => {
      const csvColumns = Object.keys(members[0]);

      if (this.isCSVImportValid(csvColumns)) {
        this.CSVImportAddMembers(members, filename);
      } else {
        this.setState({
          result: {
            ...this.state.result,
            hasError: true,
            filenames: [...this.state.result.filenames, filename],
            errorMessage: "FileCSVColumnsIssue"
          }
        });
      }

      // TODO: do something with this error
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
          result: {
            ...this.state.result,
            hasError: memberValidate.hasError
          }
        });
        if (memberValidate.hasError) {
          const errorMessage = `${this.props.form.error}. Check line ${csvLineIndex} in file ${filename}`;
          addMemberErrors.push(errorMessage);
          this.setState((state: State) => {
            const result = {
              ...state.result,
              errorMessage: addMemberErrors[0],
              errorMessages: [...state.result.errorMessages, errorMessage]
            };
            return { result };
          });
          this.props.form.$.pop();
        } else {
          console.log("no error uploading csv");
        }
      }
    };
    if (!(this.state.result.errorMessage === "FileCSVColumnsIssue")) {
      Promise.all(membersPromises)
        .then(resolvedMembers)
        .then(() => {
          if (this.state.result.errorMessages.length > 0) {
            this.setState({
              result: {
                ...this.state.result,
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
          if (!this.state.result.hasError) {
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
      result: {
        ...initState.result
      }
    });
  }

  // TODO: move the above functions that implement the CSV import functionality
  // into the library, simplifying the view logic and allowing it to be reused
  // in other apps.

  // TODO: Why is this needed? Can it be removed?
  public importCSVClick(event: React.MouseEvent) {
    // Need to this so we can select same file again and again for testing.
    // Also reset messages in Dialog.
    const element = event.target as HTMLInputElement;
    element.value = "";
    this.clearCSVFormat();
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

  private renderDialogContent() {
    const {
      result: { hasError, errorMessage, filenames, errorMessages }
    } = this.state;

    if (hasError) {
      return (
        <DialogContent>
          {errorMessage === "FileCSVColumnsIssue" ? (
            <p>
              There has been an error uploading one or more of your csv files.
              Make sure proper formatting is set on each csv file columns. ie:
              make sure the first line of each csv file looks exactly like this:
              "address,reputation,tokens"
              <br />
              <strong>An issue has been found in the following files:</strong>
              {filenames.map((name: string, index: number) => (
                <li key={index}>{name}</li>
              ))}
            </p>
          ) : (
            <p>
              <strong>
                We found one or more issues trying to add members uploaded via
                csv files.
              </strong>
              <br />
              {errorMessages.map((msg: string, index: number) => (
                <li key={index}> {msg} </li>
              ))}
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

  render() {
    const { openDialog } = this.state;

    return (
      <>
        <Fab
          size={"small"}
          color={"primary"}
          onClick={async () => {
            this.setState({
              ...initState,
              openDialog: true
            });
          }}
        >
          <AttachFile />
        </Fab>
        <Dialog onClose={this.handleDialogClose} open={openDialog}>
          {this.renderDialogContent()}
          {this.renderFormControl()}
        </Dialog>
      </>
    );
  }
}
