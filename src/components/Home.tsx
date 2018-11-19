import * as React from "react"
import { connect } from "react-redux"
import {
  withStyles,
  Typography,
  Theme,
  WithStyles,
  createStyles,
  Card,
  CardActions,
  Button,
  CardContent,
} from "@material-ui/core"
import { push } from "connected-react-router"

interface Props extends WithStyles<typeof styles> {
  createDao: () => void
}

const Home: React.SFC<Props> = ({ classes, createDao }) => (
  <>
    <Typography variant="h2" className={classes.header}>
      Testing 1234
    </Typography>
    <Card className={classes.card}>
      <CardContent>
        <Typography>Something something something.</Typography>
      </CardContent>
      <CardActions>
        <Button variant="outlined" onClick={createDao}>
          Create a DAO
        </Button>
        <Button
          variant="outlined"
          href="https://github.com/dOrgTech"
          target="_blank"
        >
          Check our GitHub
        </Button>
      </CardActions>
    </Card>
  </>
)

// STYLE
const styles = ({  }: Theme) =>
  createStyles({
    header: {
      marginTop: 100,
      textAlign: "center",
    },
    card: {
      maxWidth: 700,
      margin: "auto",
      marginTop: 100,
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
