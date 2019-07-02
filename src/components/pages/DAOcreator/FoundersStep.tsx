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
import { connect } from "react-redux"
import { Founder } from "../../../lib/integrations/arc"
import { FormValidation } from "../../../lib/forms"
import DAOcreatorActions, * as daoCreatorActions from "../../../redux/actions/daoCreator"
import PieChart from "../../common/PieChart"
import EthAddressAvatar from "../../common/EthAddressAvatar"

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  addedFounders: Founder[]
  actions: DAOcreatorActions
}

type State = Founder & {
  formErrors: {
    address: string
    tokens: string
    reputation: string
  }
  formIsValid: boolean
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
  formIsValid: false,
}

const requiredFields = ["address", "tokens", "reputation"]

class FoundersStep extends React.Component<Props, State> {
  state: Readonly<State> = initState

  onAddFounder = () => {
    this.props.actions.addFounder(this.state)
    this.setState(initState)

    this.props.actions.setStepIsValid(true)
  }

  onRemoveFounder = (addr: string) => {
    this.props.actions.removeFounder(addr)
    this.setState(initState)

    this.props.actions.setStepIsValid(true)
  }

  render() {
    const { classes, addedFounders } = this.props

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h4" className={classes.headline} gutterBottom>
            Add Founders
          </Typography>
          <Grid container spacing={16}>
            <Grid item xs={12} md={5}>
              <Typography className={classes.guideText} variant="body2">
                Here we specify the initial reputation and token distribution in
                the DAO.
                <br />
                <br />
                We do this by specifying the addresses together with the amount
                of reputation and tokens for each address.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="h6"
                className={classes.pieChartHeadlines}
                gutterBottom
              >
                Reputation Distribution
              </Typography>
              <PieChart
                data={addedFounders}
                config={{
                  hight: 240,
                  width: 240,
                  dataKey: "reputation",
                  nameKey: "address",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="h6"
                className={classes.pieChartHeadlines}
                gutterBottom
              >
                Tokens Distribution
              </Typography>
              <PieChart
                data={addedFounders}
                config={{
                  hight: 240,
                  width: 240,
                  dataKey: "tokens",
                  nameKey: "address",
                }}
              />
            </Grid>
            <Grid container spacing={16} className={classes.addLine}>
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
              <Grid item xs={1} className={classes.addButtonWrapper}>
                <Button
                  onClick={this.onAddFounder}
                  className={classes.addButton}
                  color="primary"
                  variant="contained"
                  aria-label="Add"
                  disabled={!this.state.formIsValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            {R.map(this.addedFounder, addedFounders)}
          </Grid>
        </CardContent>
      </Card>
    )
  }

  addedFounder = ({ address, reputation, tokens }: Founder) => (
    <Grid container spacing={16} key={`founder-${address}`}>
      <Grid item xs={1}>
        <EthAddressAvatar address={address} />
      </Grid>
      <Grid item xs={7}>
        <Typography>{address}</Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography>{reputation}</Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography>{tokens}</Typography>
      </Grid>
      <Grid item xs={2}>
        <Button onClick={() => this.onRemoveFounder(address)}>Delete</Button>
      </Grid>
    </Grid>
  )

  // VALIDATION
  handleChange = async (event: any) => {
    const { name, value } = event.target
    let errorMessage = ""

    const founderAlreadyPresent = (addr: string) =>
      R.any(({ address }) => R.equals(address, addr), this.props.addedFounders)

    switch (name) {
      case "address": {
        errorMessage = founderAlreadyPresent(value)
          ? ""
          : "Error: Founder already added."
        if (R.isEmpty(errorMessage)) {
          errorMessage = FormValidation.isAddress(value)
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
      default: {
      }
    }

    await this.setState({
      formErrors: R.assoc(name, errorMessage, this.state.formErrors),
      [name]: value,
    } as any)

    const formHasAllValues = R.none(
      field => R.isEmpty(R.prop(field, this.state as any)),
      requiredFields
    )

    const formIsValid =
      formHasAllValues &&
      R.none(
        key => !R.isEmpty(this.state.formErrors[key]),
        R.keys(this.state.formErrors)
      )

    this.setState({ formIsValid })
  }
}

// STYLE
const styles = (theme: Theme) =>
  createStyles({
    header: {},
    card: {},
    addButton: {},
    addLine: {
      marginBottom: 10,
      justifyContent: "center",
    },
    addButtonWrapper: {
      marginTop: "auto",
      marginRight: theme.spacing.unit,
    },
    subheader: {},
    headline: {},
    pieChartHeadlines: { textAlign: "center" },
    guideText: {
      fontSize: 18,
      maxWidth: 450,
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop: 50,
      paddingBottom: 50,
      margin: "auto",
    },
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
