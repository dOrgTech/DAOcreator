import * as React from "react"
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
          What's a DAO?
        </Button>
        <Button variant="raised" className={classes.button} onClick={createDao}>
          Create a DAO
        </Button>
        <Button variant="raised" className={classes.button}>
          Browse a DAO
        </Button>
      </CardContent>
    </Card>
  </>
)

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

export default withStyles(styles)(Home)
