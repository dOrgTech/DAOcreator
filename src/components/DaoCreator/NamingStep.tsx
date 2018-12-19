import * as R from "ramda"
import {
  Card,
  CardContent,
  createStyles,
  Grid,
  TextField,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core"
import * as React from "react"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import { AppState } from "src/AppState"
import DaoCreatorActions, * as daoCreatorActions from "../../redux/actions/daoCreator"

interface Props extends WithStyles<typeof styles> {
  daoName: string
  tokenName: string
  tokenSymbol: string
  stepNumber: number
  actions: DaoCreatorActions
}

type State = {
  daoName: string
  tokenName: string
  tokenSymbol: string
  formErrors: {
    daoName: string
    tokenName: string
    tokenSymbol: string
  }
}

const initState: State = {
  daoName: "",
  tokenName: "",
  tokenSymbol: "",
  formErrors: {
    daoName: "",
    tokenName: "",
    tokenSymbol: "",
  },
}

// TODO: Reduxify all the things!!
// send to redux onBlure
class NamingStep extends React.Component<Props, State> {
  state: Readonly<State> = initState

  handleChange = (event: any) => {
    const { name, value } = event.target
    let formErrors = { ...this.state.formErrors }
    let valide = true

    switch (name) {
      case "daoName":
        if (value.length < 3) {
          formErrors.daoName = "minimum 3 characters required"
          valide = false
        } else {
          formErrors.daoName = ""
        }
        break
      default:
        break
    }

    this.setState({ formErrors, [name]: value } as any)
      // TODO: set form validation state in redux

      const formHasAllValues = !R.isEmpty(this.state.daoName) && !R.isEmpty(this.state.tokenName) && !R.isEmpty(this.state.tokenSymbol)

    this.props.actions.setStepValidation(this.props.stepNumber, valide && formHasAllValues)
  }

  render() {
    const { classes } = this.props
    const actions = this.props.actions

    const { daoName, tokenName, tokenSymbol, formErrors } = this.state

    return (
      <Card className={classes.card}>
        <form>
          <CardContent>
            <Typography variant="h4" className={classes.headline} gutterBottom>
              Create a DAO
            </Typography>
            <Grid container spacing={16}>
              <Grid item xs={6}>
                <Grid item xs={12}>
                  <TextField
                    className={classes.daoName}
                    name="daoName"
                    label="DAO Name"
                    value={daoName}
                    onChange={this.handleChange}
                    margin="normal"
                    onBlur={() => actions.setName(daoName)}
                    fullWidth
                    required
                    error={!R.isEmpty(formErrors.daoName)}
                    helperText={formErrors.daoName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className={classes.tokenName}
                    name="tokenName"
                    label="Token Name"
                    value={tokenName}
                    onChange={this.handleChange}
                    onBlur={() => actions.setTokenName(tokenName)}
                    margin="normal"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className={classes.tokenSymbol}
                    name="tokenSymbol"
                    label="Token Symbol"
                    value={tokenSymbol}
                    onChange={this.handleChange}
                    onBlur={() => actions.setTokenSymbol(tokenSymbol)}
                    margin="normal"
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
              <Grid item xs={6}>
                Avatar?
              </Grid>
            </Grid>
          </CardContent>
        </form>
      </Card>
    )
  }
}

// STYLE
const styles = ({  }: Theme) =>
  createStyles({
    card: {},
    headline: {},
    daoName: {},
    tokenName: {},
    tokenSymbol: {},
  })

const componentWithStyles = withStyles(styles)(NamingStep)

// STATE
const mapStateToProps = (state: AppState) => {
  return {
    daoName: state.daoCreator.naming.daoName,
    tokenName: state.daoCreator.naming.tokenName,
    tokenSymbol: state.daoCreator.naming.tokenSymbol,
    stepNumber: state.daoCreator.step,
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
