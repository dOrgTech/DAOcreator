import * as React from "react";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
  Button,
  ButtonGroup,
  ExpansionPanel,
  Paper,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Grid,
  Box,
  Divider,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Link
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMoreOutlined";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import ErrorIcon from "@material-ui/icons/ErrorOutline";
import TransactionResultIcon from "@material-ui/icons/DoneOutline";
import UserApprovalIcon from "@material-ui/icons/QuestionAnswerOutlined";
import AbortedIcon from "@material-ui/icons/SmsFailedOutlined";
import SaveIcon from "@material-ui/icons/SaveSharp";
import ReactPlayer from "react-player";
import Web3 from "web3";
import {
  AnyLogLine,
  LogInfo,
  LogError,
  LogTransactionResult,
  LogUserApproval,
  LogMigrationAborted,
  LogType
} from "./LogLineTypes";
import {
  DAOMigrationCallbacks,
  DAOMigrationParams,
  migrateDAO,
  DAOMigrationResult,
  toJSON
} from "lib/dependency/arc";

import { getNetworkName } from "lib/dependency/web3";
import web3Connect from "components/common/Web3Connect"

const FileSaver = require("file-saver");

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  dao: DAOMigrationParams;
  onComplete: (result: DAOMigrationResult) => void;
  onAbort: (error: Error) => void;
  onStart: () => void;
  onStop: () => void;
}

interface State {
  logLines: AnyLogLine[];
  started: boolean;
  finished: boolean;
  ethSpent: number;
  result: DAOMigrationResult | undefined;
  logClosed: boolean;
  menuAnchor: any;
  exportOpen: boolean;
}

const initState: State = {
  logLines: [],
  started: false,
  finished: false,
  ethSpent: 0,
  result: undefined,
  logClosed: false,
  menuAnchor: undefined,
  exportOpen: false
};

class Migrator extends React.Component<Props, State> {
  web3Provider: any = {}

  constructor(props: Props) {
    super(props);
    this.state = {
      ...initState
    };
  }

  componentDidMount() {
    web3Connect.on("connect", (provider: any) => {
      (window as any).web3 = new Web3(provider)
    });

    web3Connect.toggleModal()
  }

  addLogLine = (line: AnyLogLine) => {
    const { logLines } = this.state;

    this.setState({
      ...this.state,
      logLines: [...logLines, line]
    });
  };

  onStart = async () => {
    const { onAbort, onComplete, dao } = this.props;

    // Alert in case of user closing window while deploying
    window.onbeforeunload = function () {
      return "Your migration is still in progress. Do you really want to leave?";
    };

    this.props.onStart();

    // Callbacks used for the migration
    const callbacks: DAOMigrationCallbacks = {
      userApproval: (msg: string): Promise<boolean> =>
        new Promise<boolean>(resolve =>
          this.addLogLine(
            new LogUserApproval(msg, (resp: boolean) => resolve(resp))
          )
        ),
      info: (msg: string) => this.addLogLine(new LogInfo(msg)),
      error: (msg: string) => this.addLogLine(new LogError(msg)),
      txComplete: (msg: string, txHash: string, txCost: number) =>
        new Promise<void>(resolve => {
          const { ethSpent } = this.state;
          this.setState({
            ...this.state,
            ethSpent: Number(ethSpent) + Number(txCost)
          });
          this.addLogLine(new LogTransactionResult(msg, txHash, txCost));
          resolve();
        }),
      migrationAborted: (err: Error) => {
        this.addLogLine(new LogMigrationAborted(err));
        onAbort(err);
      },
      migrationComplete: (result: DAOMigrationResult) => {
        window.onbeforeunload = function () {
          return undefined;
        };
        this.setState({
          ...this.state,
          finished: true,
          result
        });
        onComplete(result);
      },
      getState: () => {
        const state = localStorage.getItem("DAO_MIGRATION_STATE");

        if (state) {
          return JSON.parse(state);
        } else {
          return {};
        }
      },
      setState: (state: any) => {
        localStorage.setItem("DAO_MIGRATION_STATE", JSON.stringify(state));
      },
      cleanState: () => {
        localStorage.removeItem("DAO_MIGRATION_STATE");
      }
    };

    this.setState({
      ...initState,
      finished: false,
      started: true,
      result: undefined
    });
    const result = await migrateDAO(dao, callbacks);
    this.setState({ ...this.state, finished: true, result });
    this.props.onStop();
  };

  render() {
    const { dao, classes } = this.props;
    const {
      started,
      finished,
      logLines,
      ethSpent,
      result,
      logClosed,
      menuAnchor,
      exportOpen,
    } = this.state;

    const onOptionsClick = (event: any) => {
      this.setState({
        ...this.state,
        menuAnchor: event.currentTarget
      });
    };

    const onOptionsClose = () => {
      this.setState({
        ...this.state,
        menuAnchor: undefined
      });
    };

    const onSaveDAO = () => {
      var blob = new Blob([toJSON(dao)], {
        type: "text/plain;charset=utf-8"
      });
      FileSaver.saveAs(blob, "migration-params.json");
    };

    const onCopyLog = () => {
      let log = "";

      logLines.map(line => {
        return (log += line.toString() + "\n");
      });

      navigator.clipboard.writeText(log);
      this.setState({
        ...this.state,
        menuAnchor: undefined
      });
    };

    const Line: React.SFC<{
      index: number;
      icon: any;
    }> = ({ index, icon, children }) => (
      <Paper className={index % 2 === 0 ? classes.darkLine : classes.lightLine}>
        <Box overflow={"auto"} maxWidth={"100%"} display={"flex"}>
          {icon}
          {children}
        </Box>
      </Paper>
    );

    const Log = () => (
      <>
        {logLines.map((line, index) => {
          switch (line.type) {
            case LogType.Info:
              const info = line as LogInfo;
              return (
                <Line index={index} icon={<InfoIcon />}>
                  <div style={{ alignSelf: "center" }}>{info.info}</div>
                </Line>
              );
            case LogType.Error:
              const error = line as LogError;
              return (
                <Line index={index} icon={<ErrorIcon />}>
                  <div style={{ alignSelf: "center", color: "red" }}>
                    {`${error.error}`}
                  </div>
                </Line>
              );
            case LogType.TransactionResult:
              const result = line as LogTransactionResult;
              return (
                <Line index={index} icon={<TransactionResultIcon />}>
                  <Grid container direction={"column"}>
                    <Typography>{result.msg}</Typography>
                    <Typography>
                      {"Transaction: "}
                      <Link
                        onClick={async () => {
                          const network = await getNetworkName();
                          let url = `etherscan.io/tx/${result.txHash}`;

                          if (network !== "mainnet") {
                            url = `https://${network}.${url}`;
                          } else {
                            url = `https://${url}`;
                          }

                          window.open(url);
                        }}
                      >
                        {`${result.txHash.substr(0, 12)}...`}
                      </Link>
                    </Typography>
                    <Typography>{`Cost: ${result.txCost} ETH`}</Typography>
                  </Grid>
                </Line>
              );
            case LogType.UserApproval:
              const approval = line as LogUserApproval;
              const { response, question, onResponse } = approval;
              return (
                <Line index={index} icon={<UserApprovalIcon />}>
                  <Grid
                    container
                    justify={"space-between"}
                    alignItems={"center"}
                  >
                    {question}
                    <ButtonGroup size={"small"}>
                      <Button
                        onClick={() => {
                          onResponse(true);
                          approval.response = true;
                        }}
                        variant={response === true ? "contained" : "outlined"}
                        color={"primary"}
                        disabled={response !== undefined}
                        className={classes.confirmButton}
                      >
                        Yes
                      </Button>
                      <Button
                        onClick={() => {
                          onResponse(false);
                          approval.response = false;
                        }}
                        variant={response === false ? "contained" : "outlined"}
                        color={"primary"}
                        disabled={response !== undefined}
                        className={classes.confirmButton}
                      >
                        No
                      </Button>
                    </ButtonGroup>
                  </Grid>
                </Line>
              );
            case LogType.MigrationAborted:
              const aborted = line as LogMigrationAborted;
              return (
                <Line index={index} icon={<AbortedIcon />}>
                  <div style={{ alignSelf: "center", color: "red" }}>
                    {`${aborted.error}`}
                  </div>
                </Line>
              );
            default:
              throw Error("LogType Unimplemented");
          }
        })}
      </>
    );

    const ExportDialog = () => (
      <Dialog
        open={exportOpen}
        fullWidth
        onClose={() => this.setState({ ...this.state, exportOpen: false })}
        aria-labelledby={"export-dao-config"}
      >
        <DialogTitle>Export JSON Config</DialogTitle>
        <DialogContent className={classes.dialog}>
          <DialogContentText>
            <div>
              Your DAO can be exported as a json configuration file that can be
              used with the daostack/migration project. Save your DAO's
              `migration-params.json` file using the button below, and watch the
              following tutorial to understand how to manually deploy your DAO
              with this file:
            </div>
            <ReactPlayer url="https://youtu.be/SXqaWr7veus" width={550} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant={"contained"} color={"primary"} onClick={onSaveDAO}>
            Export
          </Button>
        </DialogActions>
      </Dialog>
    );

    const MigrationResults = () => {
      const text = JSON.stringify(result, null, 2);
      return (
        <>
          <Typography variant={"h6"} className={classes.successText}>
            Deployment Successful!
          </Typography>
          <div className={classes.resultWrapper}>
            <Paper className={classes.result}>
              <Button
                onClick={() => navigator.clipboard.writeText(text)}
                variant={"outlined"}
                size={"small"}
                style={{ float: "right" }}
              >
                Copy
              </Button>
              {text}
            </Paper>
            <Typography variant={"subtitle2"}>
              Now what? Copy the above text, email it to contact@dorg.tech along
              with a description of your DAO, and we'll add it to the
              https://github.com/daostack/subgraph repository for you.
            </Typography>
            <Typography variant={"subtitle2"}>
              Have feedback? Click the icon in the bottom right and let us know
              what you think!
            </Typography>
          </div>
          <Divider className={classes.resultsDivider} />
        </>
      );
    };

    return (
      <>
        <Typography variant={"subtitle2"} color={"error"}>
          NOTE: The DAO you deploy will not be available in Alchemy
          automatically. This is actively being worked on. After the deployment
          process is complete, you'll be required to send your results to an
          email address to get it added to Alchemy.
        </Typography>
        <Divider className={classes.resultsDivider} />
        <Typography variant={"subtitle2"} color={"error"}>
          WARNING: Mainnet deploy at your own risk! There are a few things being
          worked on to improve mainnet transaction handling, you can find out
          about them in the links below. The gas is currently set rather high (7
          Gwei) to try and ensure transaction succeed within 50 blocks. This is
          not fool proof.
          <br />
          https://github.com/daostack/migration/issues/211
          <br />
          https://github.com/daostack/migration/issues/206
        </Typography>
        <Divider className={classes.resultsDivider} />
        <Typography variant={"subtitle2"} color={"error"}>
          WARNING: Do not use the "Speed Up Transaction" feature in your wallet,
          this will break the deployment process. A fix is being worked on.
        </Typography>
        <Divider className={classes.resultsDivider} />
        {result ? <MigrationResults /> : <></>}
        <ExpansionPanel expanded={started && !logClosed}>
          <ExpansionPanelSummary
            expandIcon={
              finished ? (
                <ExpandMoreIcon
                  onClick={() =>
                    this.setState({ ...this.state, logClosed: !logClosed })
                  }
                />
              ) : (
                  undefined
                )
            }
            className={classes.logHeader}
          >
            <Grid container justify={"space-between"} alignItems={"center"}>
              <IconButton
                size={"small"}
                color={"primary"}
                aria-haspopup="true"
                onClick={onOptionsClick}
              >
                <SaveIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={menuAnchor !== undefined}
                keepMounted
                onClose={onOptionsClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left"
                }}
              >
                <MenuItem
                  onClick={() => {
                    this.setState({
                      ...this.state,
                      menuAnchor: undefined,
                      exportOpen: true
                    });
                  }}
                >
                  Save DAO
                </MenuItem>
                <MenuItem onClick={onCopyLog}>Copy Log</MenuItem>
              </Menu>
              {started ? (
                <Typography variant={"h6"}>Deployment Log</Typography>
              ) : (
                  <Typography variant={"h6"}>Launch Your DAO</Typography>
                )}
              {started && !finished ? (
                <CircularProgress className={classes.progressBar} />
              ) : (
                  <Button
                    onClick={this.onStart}
                    color={"primary"}
                    variant={"contained"}
                  >
                    {finished
                      ? result === undefined
                        ? "Retry?"
                        : "Re-Deploy"
                      : "Deploy"}
                  </Button>
                )}
            </Grid>
          </ExpansionPanelSummary>
          <Divider />
          <ExpansionPanelDetails>
            <Grid container direction={"column-reverse"}>
              <Log />
              <Typography variant={"subtitle2"}>
                {ethSpent} ETH Spent
              </Typography>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExportDialog />
      </>
    );
  }
}

// STYLE
const styles = (theme: Theme) =>
  createStyles({
    logHeader: {
      background: "#e4e4e4"
    },
    lightLine: {
      padding: "10px",
      background: "#e4e4e4",
      maxWidth: "100%",
      boxShadow: "none"
    },
    darkLine: {
      padding: "10px",
      background: "#c7c7c7",
      maxWidth: "100%",
      boxShadow: "none"
    },
    confirmButton: {
      fontSize: "0.7125rem"
    },
    progressBar: {
      width: "23px !important",
      height: "23px  !important"
    },
    dialog: {
      maxWidth: "690px"
    },
    result: {
      width: "100%",
      background: "#e4e4e4",
      overflowX: "hidden",
      padding: "10px",
      whiteSpace: "pre"
    },
    resultWrapper: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    },
    successText: {
      width: "100%",
      textAlign: "center"
    },
    resultsDivider: {
      marginTop: "20px",
      marginBottom: "20px"
    }
  });

export default withStyles(styles)(Migrator);
