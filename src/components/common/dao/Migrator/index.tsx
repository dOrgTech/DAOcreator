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
  CircularProgress
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMoreOutlined";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import ErrorIcon from "@material-ui/icons/ErrorOutline";
import TransactionResultIcon from "@material-ui/icons/DoneOutline";
import UserApprovalIcon from "@material-ui/icons/QuestionAnswerOutlined";
import AbortedIcon from "@material-ui/icons/SmsFailedOutlined";
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
  DAOMigrationResult
} from "lib/dependency/arc";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  dao: DAOMigrationParams;
  onComplete: (result: DAOMigrationResult) => void;
  onAbort: (error: Error) => void;
}

interface State {
  logLines: AnyLogLine[];
  started: boolean;
  finished: boolean;
  result: DAOMigrationResult | undefined;
  logClosed: boolean;
}

const initState: State = {
  logLines: [],
  started: false,
  finished: false,
  result: undefined,
  logClosed: false
};

class Migrator extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...initState
    };
    this.onStart = this.onStart.bind(this);
  }

  private addLogLine(line: AnyLogLine) {
    const { logLines } = this.state;

    this.setState({
      ...this.state,
      logLines: [...logLines, line]
    });
  }

  private async onStart() {
    const { onAbort, onComplete, dao } = this.props;

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
          this.addLogLine(new LogTransactionResult(msg, txHash, txCost));
          resolve();
        }),
      migrationAborted: (err: Error) => {
        this.addLogLine(new LogMigrationAborted(err));
        onAbort(err);
      },
      migrationComplete: (result: DAOMigrationResult) => {
        this.setState({
          ...this.state,
          finished: true,
          result
        });
        onComplete(result);
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
  }

  render() {
    const { classes } = this.props;
    const { started, finished, logLines, result, logClosed } = this.state;

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
                  <div style={{ alignSelf: "center" }}>{`${error.error}`}</div>
                </Line>
              );
            case LogType.TransactionResult:
              const result = line as LogTransactionResult;
              return (
                <Line index={index} icon={<TransactionResultIcon />}>
                  <div style={{ alignSelf: "center" }}>
                    {`${result.msg} ${result.txHash} ${result.txCost} ETH`}
                  </div>
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
                  <div style={{ alignSelf: "center" }}>
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

    return (
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
        >
          <Grid container justify={"space-between"} alignItems={"center"}>
            <Typography variant={"subtitle1"}>Deployment Log</Typography>
            {started && !finished ? (
              <CircularProgress className={classes.progressBar} />
            ) : (
              <Button
                onClick={this.onStart}
                color={"primary"}
                variant={"outlined"}
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
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

// STYLE
const styles = (theme: Theme) =>
  createStyles({
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
    }
  });

export default withStyles(styles)(Migrator);
