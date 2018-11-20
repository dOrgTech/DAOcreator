import * as React from "react"
import { connect } from "react-redux"
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
import { push } from "connected-react-router"

interface Props extends WithStyles<typeof styles> {
  createDao: () => void
}

const Home: React.SFC<Props> = ({ classes, createDao }) => (
  <>
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <Typography variant="h1" className={classes.header}>
          dOrg
        </Typography>
        <Typography variant="h5" className={classes.header}>
          Empowering Decentralized Organization
        </Typography>
        <Button variant="raised" className={classes.button}>
          What is a DAO?
        </Button>
        <Button variant="raised" className={classes.button} onClick={createDao}>
          Create a DAO
        </Button>
        <Button variant="raised" className={classes.button}>
          View Your DAO
        </Button>
      </CardContent>
    </Card>
  </>
)

// STYLE
const styles = ({  }: Theme) =>
  createStyles({
    card: {
      maxWidth: 900,
      margin: "auto",
      marginTop: 150,
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
      dispatch(push("/create-dao"))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
