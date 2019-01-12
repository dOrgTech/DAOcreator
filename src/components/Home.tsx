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

interface Props extends WithStyles<typeof styles> {
  createDao: () => void
}

const Home: React.SFC<Props> = ({ classes, createDao }) => (
  <div className={classes.cardPadding}>
    <div className={classes.cardWrapper}>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Typography variant="h1" className={classes.header}>
            dOrg
          </Typography>
          <Typography variant="h5" className={classes.header}>
            Empowering Decentralized Organization
          </Typography>
          <Button variant="contained" className={classes.button}>
            What's a DAO?
          </Button>
          <Button
            variant="contained"
            className={classes.button}
            onClick={createDao}
          >
            Create a DAO
          </Button>
          <Button variant="contained" className={classes.button}>
            Browse a DAO
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
)

// STYLE
const styles = ({  }: Theme) =>
  createStyles({
    cardPadding: {
      padding: 30,
      marginLeft: "auto",
      marginRight: "auto",
    },
    cardWrapper: {
      // bring forward (infront of background)
      position: "absolute",
      // move top-left corner to horizontal middle
      left: "50%",
      // disable pointer events, don't block background
      pointerEvents: "none",
    },
    card: {
      maxWidth: 900,
      minWidth: 500,
      // relative to parent
      position: "relative",
      // move top-left corner left by 50% width
      left: "-50%",
      // enable all pointer events
      pointerEvents: "all",
    },
    cardContent: {
      textAlign: "center",
    },
    header: {
      margin: 10,
    },
    button: {
      margin: 10,
    },
  })

const componentWithStyles = withStyles(styles)(Home)

// STATE
const mapStateToProps = (state: any) => {
  return {}
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    createDao: () => {
      dispatch(push("/dao-creator"))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
