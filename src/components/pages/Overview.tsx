import * as React from "react"
import {
  withStyles,
  Typography,
  Theme,
  WithStyles,
  createStyles,
} from "@material-ui/core"
import InfoPage from "../common/InfoPage"

interface Props extends WithStyles<typeof styles> {}

const Overview: React.SFC<Props> = ({ classes }) => (
  <InfoPage
    Content={() => (
      <>
        <Typography variant="h2" className={classes.header}>
          F.A.Q.
        </Typography>
        <Typography variant="h5">What's a DAO?</Typography>
        <Typography variant="body1" className={classes.body}>
          A Decentralized Autonomous Organization (DAO) is an entity whose
          bylaws are self-enforcing.
          <br />
          <br />
          Because DAOs run exactly as programmed without human operators,
          participants can avoid bureaucracy and focus on the tasks at hand.
        </Typography>
        <Typography variant="h5">Who needs a DAO?</Typography>
        <Typography variant="body1" className={classes.body}>
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
        </Typography>
      </>
    )}
  />
)

// STYLE
const styles = (theme: Theme) =>
  createStyles({
    body: {
      margin: 20,
    },
    header: {
      margin: 20,
      textAlign: "center",
    },
    button: {
      margin: 10,
    },
    listItem: {
      marginLeft: "35px",
      marginTop: "10px",
    },
  })

export default withStyles(styles)(Overview)
