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
          <Typography variant="body1" className={classes.body}>
            <h3>What's a DAO</h3>
            A Decentralized Autonomous Organization (DAO) is an entity whose
            bylaws are encoded in computer code that runs continuously on a
            public blockchain.
            <br />
            <br />
            Because DAOs are software-defined and self-executing, they run
            exactly as programmed without human operators. Participants can
            focus on making good decisions rather than dealing with a
            bureaucracy to enact them.
            <h3> Who needs DAOs? </h3>
            Anyone who needs to harness the collective intelligence of a
            distributed set of actors.
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
    },
    body: {
      margin: 10,
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
