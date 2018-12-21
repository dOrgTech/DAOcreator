import * as R from "ramda"
import * as React from "react"
import {
  withStyles,
  Typography,
  Theme,
  WithStyles,
  createStyles,
  Grid,
  TextField,
  Card,
  Button,
  CardContent,
} from "@material-ui/core"
import { bindActionCreators, Dispatch } from "redux"
import DaoCreatorActions, * as daoCreatorActions from "../../redux/actions/daoCreator"
import { connect } from "react-redux"
import { Founder } from "../../lib/integrations/daoStack/arc"
import * as FormValidation from "../../lib/formValidation"

interface Props extends WithStyles<typeof styles> {
  addedFounders: Founder[]
  actions: DaoCreatorActions
}

type State = Founder & {
  formErrors: {
    address: string
    tokens: string
    reputation: string
  }
  formIsValide: boolean
}

const initState: State = {
  address: "",
  tokens: "",
  reputation: "",
  formErrors: {
    address: "",
    tokens: "",
    reputation: "",
  },
  formIsValide: false,
}

const requiredFields = ["address", "tokens", "reputation"]

class FoundersStep extends React.Component<Props, State> {
  state: Readonly<State> = initState

  constructor(props: Props) {
    super(props)
    this.props.actions.setStepIsValide(false)
  }

  handleChange = async (event: any) => {
    const { name, value } = event.target
    let errorMessage = ""

    const founderAlreadyPresent = (addr: string) =>
      R.any(({ address }) => R.equals(address, addr), this.props.addedFounders)

    switch (name) {
      case "address": {
        errorMessage = FormValidation.checkIfHasError(
          founderAlreadyPresent,
          "Error: Founder already added."
        )(value)
        if (R.isEmpty(errorMessage)) {
          errorMessage = FormValidation.isValideAddress(value)
        }
        break
      }
      case "tokens": {
        errorMessage = FormValidation.isBigNumber(value)
        break
      }
      case "reputation": {
        errorMessage = FormValidation.isBigNumber(value)
        break
      }
    }
    await this.setState({
      formErrors: R.assoc(name, errorMessage, this.state.formErrors),
      [name]: value,
    } as any)

    const formHasAllValues = R.none(
      field => R.isEmpty(this.state[field]),
      requiredFields
    )

    const formIsValide =
      formHasAllValues &&
      R.none(
        key => !R.isEmpty(this.state.formErrors[key]),
        R.keys(this.state.formErrors)
      )

    this.setState({ formIsValide })
  }

  onAddFounder = () => {
    this.props.actions.addFounder(this.state)
    this.setState(initState)

    this.props.actions.setStepIsValide(true)
  }

  render() {
    const { classes, addedFounders } = this.props
    return (
      <Card className={classes.card}>
        <form>
          <CardContent>
            <Typography variant="h4" className={classes.headline} gutterBottom>
              Add Founders
            </Typography>
            <Grid container spacing={16}>
              <Grid item xs={6}>
                <TextField
                  name="address"
                  label="Wallet Address"
                  margin="normal"
                  onChange={this.handleChange}
                  value={this.state.address}
                  fullWidth
                  error={!R.isEmpty(this.state.formErrors.address)}
                  helperText={this.state.formErrors.address}
                  required
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  name="reputation"
                  label="Reputation"
                  margin="normal"
                  onChange={this.handleChange}
                  value={this.state.reputation}
                  fullWidth
                  error={!R.isEmpty(this.state.formErrors.reputation)}
                  helperText={this.state.formErrors.reputation}
                  required
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  name="tokens"
                  label="Tokens"
                  margin="normal"
                  onChange={this.handleChange}
                  value={this.state.tokens}
                  fullWidth
                  error={!R.isEmpty(this.state.formErrors.tokens)}
                  helperText={this.state.formErrors.tokens}
                  required
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  onClick={this.onAddFounder}
                  className={classes.addButton}
                  color="primary"
                  aria-label="Add"
                  disabled={!this.state.formIsValide}
                >
                  Add founder
                </Button>
              </Grid>
            </Grid>
            {R.map(this.addedFounder, addedFounders)}
          </CardContent>
        </form>
      </Card>
    )
  }

  addedFounder = ({ address, reputation, tokens }: Founder) => (
    <Grid container spacing={16} key={`founder-${address}`}>
      <Grid item xs={6}>
        <Typography>{address}</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography>{reputation}</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography>{tokens}</Typography>
      </Grid>
    </Grid>
  )
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

const componentWithStyles = withStyles(styles)(FoundersStep)

// STATE
const mapStateToProps = (state: any) => {
  return {
    addedFounders: state.daoCreator.founders,
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
