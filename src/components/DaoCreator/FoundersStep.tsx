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
import { AppState } from "src/AppState"
import DaoCreatorActions, * as daoCreatorActions from "../../redux/actions/daoCreator"
import { TypeValidation } from "../../lib/integrations/web3"
import { connect } from "react-redux"
import { Founder } from "../../lib/integrations/daoStack/arc"

interface Props extends WithStyles<typeof styles> {
  addedFounders: Founder[]
    actions: DaoCreatorActions
}

type State = Founder

const initState: State = {
  address: "",
  tokens: "",
  reputation: "",
}

class FoundersStep extends React.Component<Props, State> {
  state: Readonly<State> = initState

  handleChange = (valueName: string) => (event: any) => {
    this.setState({ [valueName]: event.target.value } as any)
  }

  onAddFounder = () => {
    this.props.actions.addFounder(this.state)
    this.setState(initState)
  }

  addressErrorCheck = (addr: string) => {
    if (!R.isEmpty(addr)) {
      if (!TypeValidation.isAddress(addr)) {
        return <Typography>Error: Please enter a valid address.</Typography>
      } else if (
        R.any(
          ({ address }) => R.equals(address, addr),
          this.props.addedFounders
        )
      ) {
        return <Typography>Error: Founder already added</Typography>
      } else {
        return <></>
      }
    } else {
      return <></>
    }
  }

  numberErrorCheck = (number: string) =>
    !R.isEmpty(number) && !TypeValidation.isBigNumber(number) ? (
      <Typography>Error: Please enter a valid number.</Typography>
    ) : (
      <></>
    )

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
                  id="address"
                  label="Wallet Address"
                  margin="normal"
                  onChange={this.handleChange("address")}
                  value={this.state.address}
                  fullWidth
                  required
                />
                {this.addressErrorCheck(this.state.address)}
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="reputation"
                  label="Reputation"
                  margin="normal"
                  onChange={this.handleChange("reputation")}
                  value={this.state.reputation}
                  fullWidth
                  required
                />
                {this.numberErrorCheck(this.state.reputation)}
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="tokens"
                  label="Tokens"
                  margin="normal"
                  onChange={this.handleChange("tokens")}
                  value={this.state.tokens}
                  fullWidth
                  required
                />
                {this.numberErrorCheck(this.state.tokens)}
              </Grid>
              <Grid item xs={2}>
                <Button
                  onClick={this.onAddFounder}
                  className={classes.addButton}
                  color="primary"
                  aria-label="Add"
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
