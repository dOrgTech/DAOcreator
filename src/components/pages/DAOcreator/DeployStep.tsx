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
  DialogActions,
  CircularProgress
} from "@material-ui/core";
import ReactPlayer from "react-player";
import { DAOcreatorState, toDAOMigrationParams } from "lib/state";
import { toJSON, migrateDAO, DAOMigrationCallbacks } from "lib/dependency/arc";

const FileSaver = require("file-saver");

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  dao: DAOcreatorState;
}

interface State {
  exportOpen: boolean;
  deploying: boolean;
}

const initState: State = {
  exportOpen: false,
  deploying: false
};

class DeployStep extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...initState
    };
  }

  render() {
    const { dao, classes } = this.props;
    const { exportOpen, deploying } = this.state;

    const onSaveFile = () => {
      var blob = new Blob([toJSON(toDAOMigrationParams(dao))], {
        type: "text/plain;charset=utf-8"
      });
      FileSaver.saveAs(blob, "migration-params.json");
    };

    const onDeploy = async () => {
      const callback: DAOMigrationCallbacks = {
        userApproval: (msg: string): Promise<boolean> => {
          console.log(msg);
          return new Promise(resolve => resolve(true));
        },
        info: (msg: string) => {
          console.log(msg);
        },
        error: (err: string) => {
          console.log(err);
        },
        txComplete: (
          msg: string,
          txHash: string,
          txCost: number
        ): Promise<void> => {
          console.log(msg);
          console.log(txHash);
          console.log(txCost);
          return new Promise(() => {});
        },
        migrationAborted: (msg: string) => {
          console.log(msg);
        }
      };
      const params = toDAOMigrationParams(dao);

      this.setState({ ...initState, deploying: true });

      await migrateDAO(params, callback);

      this.setState({ ...initState, deploying: false });
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
              onClick={() => this.setState({ ...initState, exportOpen: true })}
            >
              Export Config
            </Button>
            <Dialog
              open={exportOpen}
              fullWidth
              onClose={() => this.setState({ ...initState, exportOpen: false })}
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
                  onClick={onSaveFile}
                >
                  Export
                </Button>
              </DialogActions>
            </Dialog>
            <Button variant={"contained"} color={"primary"} onClick={onDeploy}>
              Deploy DAO
            </Button>
            {deploying ? <CircularProgress /> : <></>}
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
