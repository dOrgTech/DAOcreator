import * as React from "react";
import { Fab, FormControl, Dialog, DialogTitle } from "@material-ui/core";
import { AttachFile } from "@material-ui/icons";
import { MembersForm } from "../../../lib/forms";
import { MemberCSVImportState } from "../../../lib/state";

interface Props {
  form: MembersForm;
  memberCVSImport: any;
}

const fileReader: FileReader = new FileReader();

export default class MemberCSVImport extends React.Component<
  Props,
  MemberCSVImportState
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openDialog: false
    };
    this.handleFileRead = this.handleFileRead.bind(this);
  }

  public handleDialogClose(): void {
    this.setState({ openDialog: false });
  }

  public handleFileChosen(file: any): void {
    fileReader.onloadend = this.handleFileRead;
    fileReader.readAsText(file);
  }

  private handleFileRead(): void {
    const csv: any = fileReader.result;
    const lines: any = csv.split("\n");
    let members: any = [];
    let columns = lines[0].split(",");
    for (let index = 1; index < lines.length; index++) {
      let member: any = {};
      let row: any = lines[index].split(",");
      for (let index2 = 0; index2 < columns.length; index2++) {
        member[columns[index2]] = row[index2];
      }
      members.push(member);
    }
    if (this.props.memberCVSImport(members.slice(0, -1)))
      this.handleDialogClose();
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
            <input
              type="file"
              id="file"
              accept=".csv"
              onChange={event => this.handleFileChosen(event.target.files![0])}
            />
          </FormControl>
        </Dialog>
      </>
    );
  }
}
