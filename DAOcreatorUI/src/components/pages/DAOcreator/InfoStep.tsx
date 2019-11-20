import * as React from "react";
import {
  Card,
  CardContent,
  createStyles,
  Theme,
  Typography,
  withStyles,
  WithStyles,
  Button
} from "@material-ui/core";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  toNamingStep: () => void;
}

class InfoStep extends React.Component<Props> {
  render() {
    const { classes, toNamingStep } = this.props;

    return (
      <Card>
        <CardContent>
          <Typography variant="h2" className={classes.header}>
            Warning
          </Typography>
          <Typography variant="h5">Metamask Required</Typography>
          <Typography variant="body1" className={classes.body}>
            To interact with this application you will need the{" "}
            <a href="https://metamask.io">Metamask browser extension</a>.
          </Typography>
          <Typography variant="h5">DAO Creator is in Alpha</Typography>
          <Typography variant="body1" className={classes.body}>
            This tool is for advanced users only. We do not advise new users
            deploy DAOs to mainnet at this time.
            <br />
            To provide feedback, go{" "}
            <a href="https://docs.google.com/forms/d/1qMwTYMFpLW0KU8l9dnHkhixwhz-fo5Qtqumjg_7JZ80">
              here
            </a>
            . For any questions, reach out on{" "}
            <a href="https://discord.gg/6Kujmad">Discord</a>!
          </Typography>
          <Button
            variant="contained"
            size="small"
            className={classes.button}
            onClick={toNamingStep}
          >
            Proceed
          </Button>
        </CardContent>
      </Card>
    );
  }
}

// STYLE
const styles = (theme: Theme) =>
  createStyles({
    body: {
      margin: 20
    },
    header: {
      margin: 20,
      textAlign: "center"
    },
    button: {
      margin: 10
    }
  });

export default withStyles(styles)(InfoStep);
