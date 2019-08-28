// TODO: options:
//       - export button (popover w/ download button + youtube video for how to use the file)
//       - multi-step process for deployment
import * as React from "react";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
  Card,
  CardContent,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@material-ui/core";
import ReactPlayer from "react-player";
import { DAOcreatorState } from "lib/state";
import { serializeDAO } from "lib/dependency/arc";

const FileSaver = require("file-saver");

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  dao: DAOcreatorState;
}

interface State {
  exportOpen: boolean;
}

class DeployStep extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      exportOpen: false
    };
  }

  render() {
    const { dao, classes } = this.props;
    const { exportOpen } = this.state;

    const saveFile = () => {
      var blob = new Blob([serializeDAO(dao)], {
        type: "text/plain;charset=utf-8"
      });
      FileSaver.saveAs(blob, "migration-params.json");
    };

    return (
      <Card>
        <CardContent>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            <Button
              variant={"contained"}
              color={"primary"}
              onClick={() => this.setState({ exportOpen: true })}
            >
              Export Config
            </Button>
            <Dialog
              open={exportOpen}
              fullWidth
              onClose={() => this.setState({ exportOpen: false })}
              aria-labelledby={"export-dao-config"}
            >
              <DialogTitle>Export JSON Config</DialogTitle>
              <DialogContent className={classes.dialog}>
                <DialogContentText>
                  <div>
                    Your DAO can be exported as a json configuration file that
                    can be used with the daostack/migration project. Save your
                    DAO's `migration-params.json` file using the button below,
                    and watch the following tutorial to understand how to
                    manually deploy your DAO with this file:
                  </div>
                  <ReactPlayer url="https://youtu.be/SXqaWr7veus" width={550} />
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  variant={"contained"}
                  color={"primary"}
                  onClick={saveFile}
                >
                  Export
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

// STYLE
const styles = (theme: Theme) =>
  createStyles({
    dialog: {
      maxWidth: "690px"
    }
  });

export default withStyles(styles)(DeployStep);
