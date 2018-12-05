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
import { BigNumber } from "bignumber.js"

interface Props extends WithStyles<typeof styles> {
  addFounder: (founder: Founder) => void
  founders: Founder[]
}

type State = Founder

const initState: State = {
  address: "",
  tokens: "",
  reputation: "",
}

class FoundersStep extends React.Component<Props, State> {
  state: Readonly<State> = initState
  // TODO @Asgeir, I think we should move this "cleansing" logic to our Ark code, since it knows
  // we're going to convert our Founder type to the "FounderConfig" in DAOstack
  cleanseAddress = (address: string): boolean => {
    // TODO
    return true
  }

  cleanseBigNumber = (number: string): boolean => {
    try {
      new BigNumber(number)
      return true
    } catch {
      return false
    }
  }
  /////////////////

  handleChange = (valueName: string) => (event: any) => {
    this.setState({ [valueName]: event.target.value } as any)
  }

  onAddFounder = async () => {
    this.props.addFounder(this.state)
    await this.setState(initState)
  }

  render() {
    const { classes, founders } = this.props
    return (
      <Card className={classes.card}>
        <form>
          <CardContent>
            <Typography variant="h5" className={classes.headline} gutterBottom>
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

            <Grid container spacing={16}>
              {R.map(this.addedFounder, founders)}
            </Grid>
          </CardContent>
        </form>
      </Card>
    )
  }

  addedFounder = ({ address, reputation, tokens }: Founder) => (
    <>
      <Grid item xs={6}>
        <Typography>{address}</Typography>
        {this.cleanseAddress(address) ? (
          <></>
        ) : (
          <Typography>Error: Please enter a valid address.</Typography>
        )}
      </Grid>
      <Grid item xs={2}>
        <Typography>{reputation}</Typography>
        {this.cleanseBigNumber(reputation) ? (
          <></>
        ) : (
          <Typography>Error: Please enter a valid number.</Typography>
        )}
      </Grid>
      <Grid item xs={2}>
        <Typography>{tokens}</Typography>
        {this.cleanseBigNumber(tokens) ? (
          <></>
        ) : (
          <Typography>Error: Please enter a valid number.</Typography>
        )}
      </Grid>
    </>
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

export default withStyles(styles)(FoundersStep)
