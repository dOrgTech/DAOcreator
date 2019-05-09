import * as React from "react"
import { connect } from "react-redux"
import { push } from "connected-react-router"
import {
  withStyles,
  Typography,
  Theme,
  WithStyles,
  createStyles,
  Card,
  Button,
  CardContent,
} from "@material-ui/core"

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  goHome: () => void
}

const Overview: React.SFC<Props> = ({ classes, goHome }) => (
  <div className={classes.root}>
    <Button
      variant="contained"
      size="small"
      className={classes.button}
      onClick={goHome}
    >
      Back to Home
    </Button>
    <div className={classes.cardWrapper}>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
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
            Any group that needs to allocate resources, make decisions and
            govern itself in a manner that is:
            <li style={{ marginLeft: "35px", marginTop: "10px" }}>
              Cheap → bureaucracy-free
            </li>
            <li style={{ marginLeft: "35px", marginTop: "10px" }}>
              Secure → resilient to bad actors
            </li>
            <li style={{ marginLeft: "35px", marginTop: "10px" }}>
              Scalable → effective at scale
            </li>
            <li style={{ marginLeft: "35px", marginTop: "10px" }}>
              Dynamic → fully programmable
            </li>
            <li style={{ marginLeft: "35px", marginTop: "10px" }}>
              Borderless → jurisdiction agnostic{" "}
            </li>
            <li style={{ marginLeft: "35px", marginTop: "10px" }}>
              Transparent → easy to audit
            </li>
          </Typography>
        </CardContent>
      </Card>
    </div>
  </div>
)

// STYLE
const padding = 50
const minWidth = 800
const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      minWidth: minWidth + padding * 2,
      height: "100vh",
    },
    cardWrapper: {
      width: 0,
      position: "relative",
      left: "50%",
      pointerEvents: "none",
    },
    cardContent: {},
    card: {
      maxWidth: 1200,
      minWidth: minWidth,
      position: "inherit",
      transform: "translateX(-50%)",
      pointerEvents: "all",
      marginBottom: 40,
    },
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
  })

const componentWithStyles = withStyles(styles)(Overview)

// STATE
const mapStateToProps = (state: any) => {
  return {}
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    goHome: () => {
      dispatch(push("/"))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
