import * as React from "react";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
  Card,
  CardContent
} from "@material-ui/core";
import { DAOcreatorState, toDAOMigrationParams } from "lib/state";
import { DAOMigrationResult } from "lib/dependency/arc";
import Migrator from "components/common/dao/Migrator";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  dao: DAOcreatorState;
}

class DeployStep extends React.Component<Props> {
  render() {
    const { dao, classes } = this.props;

    return (
      <Card>
        <CardContent className={classes.root}>
          <Migrator
            dao={toDAOMigrationParams(dao)}
            onComplete={(result: DAOMigrationResult) => {
              console.log(result);
            }}
            onAbort={(error: Error) => {
              console.log(error.message);
            }}
          />
        </CardContent>
      </Card>
    );
  }
}

// STYLE
const styles = (theme: Theme) =>
  createStyles({
    root: {
      maxWidth: "100%"
    }
  });

export default withStyles(styles)(DeployStep);
