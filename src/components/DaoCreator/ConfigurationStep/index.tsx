import { AppState } from "src/AppState"
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
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import DaoCreatorActions, * as daoCreatorActions from "../../../redux/actions/daoCreator"

interface Props extends WithStyles<typeof styles> {
  stepNumber: number
  stepValide: boolean
  actions: DaoCreatorActions
}

type State = {}

const initState: State = {}

class ConfigurationStep extends React.Component<Props, State> {
  state: Readonly<State> = initState

  constructor(props: Props) {
    super(props)
    props.actions.setStepValidation(props.stepNumber, true)
  }

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

const componentWithStyles = withStyles(styles)(ConfigurationStep)

const mapStateToProps = (state: AppState) => {
  return {
    stepNumber: state.daoCreator.step,
    stepValide: state.daoCreator.stepValidation[state.daoCreator.step],
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    actions: bindActionCreators(daoCreatorActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
