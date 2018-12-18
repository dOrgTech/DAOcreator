import {
  Card,
  CardContent,
  Typography,
  Grid,
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core"
import * as React from "react"
import AddSchemas from "./AddSchemas"
import SetVotingMachine from "./SetVotingMachine"

interface Props extends WithStyles<typeof styles> {}

type State = {}

const initState: State = {}

class ConfigurationStep extends React.Component<Props, State> {
  state: Readonly<State> = initState

  render() {
    const { classes } = this.props
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h4" className={classes.headline} gutterBottom>
            Configuration
          </Typography>
          <Grid container spacing={16}>
            <Grid item xs={6}>
              <AddSchemas />
            </Grid>

            <Grid item xs={6}>
              <SetVotingMachine />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }
}

// STYLE
const styles = ({  }: Theme) =>
  createStyles({
    header: {},
    card: {},
    addButton: {},
    subheader: {},
    headline: {},
  })

export default withStyles(styles)(ConfigurationStep)
