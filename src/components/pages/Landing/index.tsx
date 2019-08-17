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
import CaseCard from "./CaseCard";

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
      <Grid item xs={3} className={classes.learnMoreCard}>
        <LearnMoreCard
          icon={"/icons/flock.svg"}
          title={"Hire dOrg"}
          description={
            "We can develop anything, from small and fast prototypes, to finished polished products."
          }
        />
      </Grid>
      <Grid item xs={3} className={classes.learnMoreCard}>
        <LearnMoreCard
          icon={"/icons/explorer.svg"}
          title={"Join dOrg"}
          description={
            "Work with a talented, ever growing, community of developers from around the world."
          }
        />
      </Grid>
    </Grid>
    <Grid
      container
      direction={"column"}
      justify={"flex-start"}
      alignItems={"center"}
    >
      <Grid item className={classes.centerText}>
        <Typography align={"center"} variant={"h3"}>
          Let's Build Together
        </Typography>
        <Typography align={"center"} variant={"h5"}>
          dOrg is a self-organized developer community that wills software into
          existence.
        </Typography>
      </Grid>
      <Grid item className={classes.cases}>
        <Typography align={"center"} variant={"h4"}>
          Cases
        </Typography>
        <Grid
          container
          direction={"row"}
          justify={"space-evenly"}
          alignItems={"flex-start"}
        >
          <Grid item xs={3} className={classes.caseCard}>
            <CaseCard
              icon={"/icons/gnosis.svg"}
              title={"Continuous Funding"}
              description={"Bonding curve based funding module for DAOs."}
              github={"https://github.com/dOrgTech/BC-DAO"}
            />
          </Grid>
          <Grid item xs={3} className={classes.caseCard}>
            <CaseCard
              icon={"/icons/etoro.svg"}
              title={"Identity DAO"}
              description={"DAO curated registry of human identities."}
              github={"https://github.com/dOrgTech/ID-DAO"}
            />
          </Grid>
          <Grid item xs={3} className={classes.caseCard}>
            <CaseCard
              icon={"/icons/daostack.svg"}
              title={"DAOcreator"}
              description={"Wizard for DAO design and deployment."}
              github={"https://github.com/dOrgTech/DAOcreator"}
              test={"https://dorg.tech/#/dao-creator"}
            />
          </Grid>
          <Grid item xs={3} className={classes.caseCard}>
            <CaseCard
              icon={"/icons/daostack.svg"}
              title={"DAOcomponents"}
              description={"DAO enabling React applications."}
              github={"https://github.com/dOrgTech/DAOcomponents"}
            />
          </Grid>
        </Grid>
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
    learnMoreCard: {
      minWidth: "270px",
      maxWidth: "400px",
      margin: "20px"
    },
    centerText: {
      margin: "20px",
      paddingTop: "20px",
      maxWidth: "680px"
    },
    cases: {
      margin: "20px",
      paddingTop: "20px"
    },
    caseCard: {
      minWidth: "395px",
      maxWidth: "600px",
      margin: "20px"
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
