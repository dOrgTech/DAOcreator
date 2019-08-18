import * as React from "react";
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles,
  Grid,
  Typography,
  Divider
} from "@material-ui/core";
import LearnMore from "./LearnMore";
import CaseCard from "./CaseCard";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {}

const Landing: React.SFC<Props> = ({ classes }) => (
  <div className={classes.root}>
    <Grid
      container
      direction={"column"}
      justify={"flex-start"}
      alignItems={"center"}
    >
      <Grid item className={classes.centerText}>
        <Typography align={"center"} variant={"h2"} className={classes.header}>
          Let's Build Together
        </Typography>
      </Grid>
      <LearnMore />
      <Grid item className={classes.cases}>
        <Divider className={classes.casesDivider} />
        <Typography align={"center"} variant={"h3"} className={classes.header}>
          Cases
        </Typography>
        <Divider />
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
              test={"https://www.npmjs.com/package/@dorgtech/daocomponents"}
            />
          </Grid>
        </Grid>
      </Grid>
      <Typography className={classes.copyright}>
        © 2019 dOrg, BBLLC. All Rights Reserved.
      </Typography>
    </Grid>
  </div>
);

// STYLE
const styles = (theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
      height: "100vh",
      // bring forward (infront of background)
      position: "relative",
      // disable pointer events, don't block background
      pointerEvents: "none"
    },
    header: {
      color: "#4bd2c6"
    },
    subHeader: {
      marginBottom: "20px",
      color: "white"
    },
    centerText: {
      marginTop: "40px",
      maxWidth: "680px"
    },
    cases: {
      margin: "20px",
      paddingTop: "20px",
      maxWidth: "840px"
    },
    casesDivider: {
      marginBottom: "50px"
    },
    caseCard: {
      minWidth: "380px",
      maxWidth: "420px",
      margin: "20px"
    },
    copyright: {
      color: "white"
    }
  });

export default withStyles(styles)(Landing);
