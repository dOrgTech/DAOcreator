import * as React from "react";
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles,
  Grid,
  Typography
} from "@material-ui/core";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {}

const About: React.SFC<Props> = ({ classes }) => {
  const Header: React.SFC = ({ children }) => (
    <Typography variant={"h4"} className={classes.header}>
      {children}
    </Typography>
  );

  const Subheader: React.SFC = ({ children }) => (
    <Typography variant={"h6"} className={classes.subheader}>
      {children}
    </Typography>
  );

  const Body: React.SFC = ({ children }) => (
    <Typography variant={"body1"} className={classes.body}>
      {children}
    </Typography>
  );

  return (
    <div className={classes.root}>
      <Grid
        container
        direction={"column"}
        justify={"flex-start"}
        className={classes.container}
      >
        <Header>
          dOrg is a self-organized developer community that wills software into
          existence.
        </Header>
        <Body>
          We are a cooperative of freelancers building tools for distributed
          organizations. We make ecosystem partnerships and execute on work that
          advances the open-source DAO ecosystem.
        </Body>
        <Header>How we do it.</Header>
        <Body>
          Our freelancer co-op rests on two core technologies:
          <li className={classes.listItem}>
            <i>DAOstack:</i> We conduct 100% of our operations and governance
            through{" "}
            <a className={classes.link} href="https://alchemy.daostack.io">
              our own DAO
            </a>
            .
          </li>
          <li className={classes.listItem}>
            <i>Blockchain Based LLC:</i> Our DAO is a legally registered{" "}
            <a
              className={classes.link}
              href="https://legislature.vermont.gov/statutes/section/11/025/04173"
            >
              Vermont BBLLC
            </a>
            .
          </li>
        </Body>
        <Header>F.A.Q.</Header>
        <Subheader>What's a DAO?</Subheader>
        <Body>
          A Decentralized Autonomous Organization (DAO) is an entity whose
          bylaws are self-enforcing. Because DAOs run exactly as programmed
          without human operators, participants can avoid bureaucracy and focus
          on the tasks at hand.
        </Body>
        <Subheader>Who needs a DAO?</Subheader>
        <Body>
          Any group that needs to allocate resources, make decisions and govern
          itself in a manner that is:
          <li className={classes.listItem}>Cheap → bureaucracy-free</li>
          <li className={classes.listItem}>Secure → resilient to bad actors</li>
          <li className={classes.listItem}>Scalable → effective at scale</li>
          <li className={classes.listItem}>Dynamic → fully programmable</li>
          <li className={classes.listItem}>
            Borderless → jurisdiction agnostic{" "}
          </li>
          <li className={classes.listItem}>Transparent → easy to audit</li>
        </Body>
      </Grid>
    </div>
  );
};

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
    container: {
      width: "80%",
      maxWidth: "800px",
      margin: "auto",
      marginBottom: "20px"
    },
    header: {
      marginTop: "30px",
      color: "#4bd2c6",
      pointerEvents: "all"
    },
    subheader: {
      marginTop: "15px",
      marginBottom: "-10px",
      color: "#4bd2c6",
      pointerEvents: "all"
    },
    body: {
      marginTop: "15px",
      color: "white",
      pointerEvents: "all"
    },
    link: {
      color: "white"
    },
    listItem: {
      marginLeft: "15px",
      marginTop: "5px"
    }
  });

export default withStyles(styles)(About);
