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

const About: React.SFC<Props> = ({ classes, goHome }) => (
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
            About dOrg
          </Typography>
          <Typography variant="body1" className={classes.body}>
            <h3>What we do</h3>
            dOrg is a cooperative of freelancers building tools for distributed
            organizations. We make ecosystem partnerships and execute on work
            that advances the open-source DAO ecosystem.
            <br />
            <br />
            For the full picture, visit our{" "}
            <a href="https://github.com/dOrgTech/vision/blob/master/README.md">
              project overview
            </a>{" "}
            on Github.
            <h3>How we do it</h3>
            Our freelancer co-op rests on two core technologies:
            <ol>
              <li>
                <i>DAOstack:</i> We conduct 100% of our operations and
                governance through{" "}
                <a href="https://alchemy.daostack.io">our own DAO.</a>
              </li>
              <br />
              <li>
                <i>Blockchain Based LLC:</i> Our DAO is a legally registered{" "}
                <a href="https://legislature.vermont.gov/statutes/section/11/025/04173">
                  Vermont BBLLC
                </a>
              </li>
            </ol>
            <h3>Get in touch</h3>
            Contact us through <a href="mailto:contact@dorg.tech">
              email
            </a> or <a href="https://discord.gg/6Kujmad">Discord</a>.
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

const componentWithStyles = withStyles(styles)(About)

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
