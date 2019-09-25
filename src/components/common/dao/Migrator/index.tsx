import * as React from "react";
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";
import LogError from "./LogError";
import LogInfo from "./LogInfo";
import TransactionResult from "./TransactionResult";
import UserApproval from "./UserApproval";
import MigrationAborted from "./MigrationAborted";
import {
  DAOMigrationCallbacks,
  DAOMigrationParams,
  migrateDAO,
  DAOMigrationResult
} from "lib/dependency/arc";

type LogLine = LogError | LogInfo | TransactionResult | UserApproval;

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  dao: DAOMigrationParams;
  onComplete: (result: DAOMigrationResult) => void;
  onAbort: (error: Error) => void;
}

interface State {
  logLines: LogLine[];
  started: boolean;
  finished: boolean;
  result: DAOMigrationResult | undefined;
}

const initState: State = {
  logLines: [],
  started: false,
  finished: false,
  result: undefined
};

class Migrator extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...initState
    };
  }

  private addLogLine(line: LogLine) {
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
          this.addLogLine(<UserApproval question={msg} onResponse={resolve} />)
        ),
      info: (msg: string) => this.addLogLine(<LogInfo info={msg} />),
      error: (msg: string) => this.addLogLine(<LogError error={msg} />),
      txComplete: (msg: string, txHash: string, txCost: number) =>
        new Promise<void>(resolve => {
          this.addLogLine(
            <TransactionResult
              description={msg}
              txHash={txHash}
              txCost={txCost}
            />
          );
          // TODO: some for of user input here?
          resolve();
        }),
      migrationAborted: (err: Error) => {
        this.addLogLine(<MigrationAborted error={err} />);
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

    this.setState({ ...initState, started: true });
    await migrateDAO(dao, callbacks);
    this.setState({ ...this.state, finished: true });
  }

  render() {
    // TODO:
    // if (started === false) play button
    // else if (finished === false) log
    // else minimized log & result
  }
}

// STYLE
const styles = (theme: Theme) => createStyles({});

export default withStyles(styles)(Migrator);
