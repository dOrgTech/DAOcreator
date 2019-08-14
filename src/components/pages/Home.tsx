import * as React from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import {
  withStyles,
  Typography,
  Theme,
  WithStyles,
  createStyles,
  Card,
  Button,
  CardContent,
  Grid
} from "@material-ui/core";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  gotoOverview: () => void;
  gotoDapp: () => void;
  gotoAbout: () => void;
}

const Home: React.SFC<Props> = ({
  classes,
  gotoOverview,
  gotoDapp,
  gotoAbout
}) => (
  <Grid
    container
    className={classes.root}
    alignContent="center"
    alignItems="center"
    direction="column"
    justify="center"
  >
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <Typography variant="h2" className={classes.header} align="center">
          dOrg
        </Typography>
        <Grid
          container
          className={classes.subtitleContainer}
          direction="row"
          justify="center"
          spacing={1}
        >
          <Grid item>
            <Typography variant="subtitle1" className={classes.header}>
              Empowering
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" className={classes.header}>
              Distributed
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" className={classes.header}>
              Organizations
            </Typography>
          </Grid>
        </Grid>
        <Grid container justify="center" spacing={2} direction="row">
          <Grid key={"about"} item>
            <Button
              variant="contained"
              size="small"
              className={classes.button}
              onClick={gotoAbout}
            >
              About
            </Button>
          </Grid>
          <Grid key={"create"} item>
            <Button
              variant="contained"
              size="small"
              className={classes.button}
              onClick={gotoDapp}
            >
              Create a DAO
            </Button>
          </Grid>
          <Grid key={"faq"} item>
            <Button
              variant="contained"
              size="small"
              className={classes.button}
              onClick={gotoOverview}
            >
              F.A.Q.
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  </Grid>
);

// STYLE
const styles = (theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
      height: "75vh",
      // bring forward (infront of background)
      position: "relative",
      // disable pointer events, don't block background
      pointerEvents: "none"
    },
    card: {
      margin: 16,
      pointerEvents: "all"
    },
    cardContent: {},
    header: {},
    subtitleContainer: {},
    button: {
      margin: 5
    }
  });

const componentWithStyles = withStyles(styles)(Home);

// STATE
const mapStateToProps = (state: any) => {
  return {};
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    gotoDapp: () => {
      dispatch(push("/dapp"));
    },
    gotoOverview: () => {
      dispatch(push("/overview"));
    },
    gotoAbout: () => {
      dispatch(push("/about"));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles);
