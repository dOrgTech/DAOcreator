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
import { cleanseAddress, cleanseBigNumber } from "../../integrations/web3"

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

  handleChange = (valueName: string) => (event: any) => {
    this.setState({ [valueName]: event.target.value } as any)
  }

  onAddFounder = () => {
    this.props.addFounder(this.state)
    this.setState(initState)
  }

  addressErrorCheck = (addr: string) =>
    addr && !cleanseAddress(addr) ? (
      <Typography>Error: Please enter a valid address.</Typography>
    ) : (
      <></>
    )

  numberErrorCheck = (number: string) =>
    number && !cleanseBigNumber(number) ? (
      <Typography>Error: Please enter a valid number.</Typography>
    ) : (
      <></>
    )

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
      </Grid>
      <Grid item xs={2}>
        <Typography>{reputation}</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography>{tokens}</Typography>
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
