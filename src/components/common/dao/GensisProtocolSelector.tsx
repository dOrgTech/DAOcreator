import * as React from "react";
import { Theme, createStyles, WithStyles, withStyles } from "@material-ui/core";
import { GenesisProtocolForm } from "../../../lib/forms";

interface Props extends WithStyles<typeof styles> {
  onSelect: (genesisProtocol: GenesisProtocolForm) => void;
}

class GenesisProtocolSelector extends React.Component<Props> {
  render() {
    return <></>;
  }
}

const styles = (theme: Theme) => createStyles({});

export default withStyles(styles)(GenesisProtocolSelector);
