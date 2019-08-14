import * as React from "react";
import { Fab, FormControl, Dialog, DialogTitle } from "@material-ui/core";
import { AttachFile } from "@material-ui/icons";
import parse from "csv-parse";
import { MembersForm, MemberForm } from "../../../lib/forms";
import { MemberCSVImportState } from "../../../lib/state";

interface Props {
  form: MembersForm;
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
    const parseCSV = (error: any, members: MemberForm[]) => {
      const addMembers = (member: any, index: number) => {
        let newMember = new MemberForm(this.props.form.getDAOTokenSymbol);
        newMember.$.address.value = member.address;
        newMember.$.reputation.value = member.reputation;
        newMember.$.tokens.value = member.tokens;
        this.props.form.$.push(newMember);
      };
      members.map(addMembers);
      this.handleDialogClose();
      if (error) console.log("error", error);
    };
    parse(csv, { columns: true }, parseCSV);
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
