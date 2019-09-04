import * as React from "react";
import { Fab } from "@material-ui/core";
import { MembersForm } from "lib/forms";
import GetAppIcon from "@material-ui/icons/GetApp";
import { saveAs } from "file-saver";

interface Props {
  form: MembersForm;
}

export default class MembersExporter extends React.Component<Props> {
  render() {
    const download = () => {
      let text: string = "address, reputation, token \r\n";
      for (var element of this.props.form.$) {
        let { address, reputation, tokens } = element.$;
        text += `${address.$}, ${reputation.$}, ${tokens.$} \r\n`;
      }
      const file = new File([text], "dao-members.csv");
      saveAs(file);
    };
    return (
      <Fab size={"small"} color={"primary"} onClick={download}>
        <GetAppIcon />
      </Fab>
    );
  }
}
