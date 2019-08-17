import * as React from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles,
  Grid,
  Typography
} from "@material-ui/core";
import LearnMoreCard from "./LearnMoreCard";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  gotoOverview: () => void;
  gotoDapp: () => void;
  gotoAbout: () => void;
}

const Landing: React.SFC<Props> = ({
  classes,
  gotoOverview,
  gotoDapp,
  gotoAbout
}) => (
  <div className={classes.root}>
    <Grid
      container
      direction={"row"}
      justify={"center"}
      alignItems={"flex-start"}
    >
      <Grid item xs={3} className={classes.learnMoreTile}>
        <LearnMoreCard
          icon={"/icons/flock.svg"}
          title={"Hire dOrg"}
          description={
            "We can develop anything, from small and fast prototypes, to finished polished products."
          }
        />
      </Grid>
      <Grid item xs={3} className={classes.learnMoreTile}>
        <LearnMoreCard
          icon={"/icons/explorer.svg"}
          title={"Join dOrg"}
          description={
            "Work with a talented, ever growing, community of developers from around the world."
          }
        />
      </Grid>
    </Grid>
    <Grid container justify={"center"}>
      <Grid item className={classes.centerText}>
        <Typography align={"center"} variant={"h3"}>
          Let's Build Together
        </Typography>
        <Typography align={"center"} variant={"h5"}>
          dOrg is a self-organized developer community that wills software into
          existence.
        </Typography>
      </Grid>
    </Grid>
  </div>
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
    header: {
      pointerEvents: "all",
      height: "50px",
      width: "100%"
    },
    learnMoreTile: {
      minWidth: "270px",
      maxWidth: "400px",
      margin: "20px"
    },
    centerText: {
      margin: "20px",
      paddingTop: "30px",
      maxWidth: "680px"
    }
  });

const componentWithStyles = withStyles(styles)(Landing);

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
