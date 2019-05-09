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

import DAOcreator from "./DAOcreator"

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  createDao: () => void
  goHome: () => void
}

const Dapp: React.SFC<Props> = ({ classes, goHome, createDao }) => (
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
            Warning
          </Typography>
          <Typography variant="body1" className={classes.body}>
            <h3>Metamask Required</h3>
            To interact with this application you will need the{" "}
            <a href="https://metamask.io">Metamask browser extension.</a>{" "}
            <h3>DAO Creator is in Alpha</h3>
            This tool is for advanced users only. We do not advise new users
            deploy DAOs to mainnet at this time.
          </Typography>
          <Button
            variant="contained"
            size="small"
            className={classes.button}
            onClick={createDao}
          >
            Proceed
          </Button>
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

const componentWithStyles = withStyles(styles)(Dapp)

// STATE
const mapStateToProps = (state: any) => {
  return {}
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    goHome: () => {
      dispatch(push("/"))
    },
    createDao: () => {
      dispatch(push("/dao-creator"))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
