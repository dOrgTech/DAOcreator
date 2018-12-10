import { Card, createStyles, Theme, withStyles, WithStyles } from "@material-ui/core";
import * as React from "react";
import AddSchemas from "./AddSchemas";
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
        <AddSchemas />
        <SetVotingMachine/>
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
