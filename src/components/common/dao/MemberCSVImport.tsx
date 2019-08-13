import * as React from "react";
// import { Grid } from "@material-ui/core";
// import FormField from "../FormField";
import { MembersForm } from "../../../lib/forms";

interface Props {
  form: MembersForm;
  // editable: boolean;
}

export default class MemberCSVImport extends React.Component<Props> {
  public fileReader: any;

  handleFileRead(e: any): void {
    const content = this.fileReader.result;
    console.log(content);
  }

  handleFileChosen(file: any): void {
    this.fileReader = new FileReader();
    this.fileReader.onloadend = this.handleFileRead;
    this.fileReader.readAsText(file);
  }

  render() {
    // const { form, editable } = this.props;

    return (
      <>
        <input
          type="file"
          id="file"
          accept=".csv"
          onChange={e => this.handleFileChosen(e.target.files![0])}
        />

        {/* <div>MemberCSVImport</div> */}
        {/*<Grid item sm={4} xs={8}>
          <FormField field={form.$.address} editable={editable} />
        </Grid>
        <Grid item sm={3} xs={5}>
          <FormField field={form.$.reputation} editable={editable} />
        </Grid>
        <Grid item sm={3} xs={5}>
          <FormField field={form.$.tokens} editable={editable} />
        </Grid>*/}
      </>
    );
  }
}
