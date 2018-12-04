import * as R from "ramda"
import * as React from "react"
import { connect } from "react-redux"
import * as blockies from "ethereum-blockies-png"
import {
  withStyles,
  Typography,
  Theme,
  WithStyles,
  createStyles,
  Grid,
  TextField,
  Card,
  CardHeader,
  CardActions,
  Button,
  CardContent,
  ListSubheader,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import AddIcon from "@material-ui/icons/Add"

interface Props extends WithStyles<typeof styles> {
  addFounder: (founder: Founder) => void
  founders: Founder[]
}

type State = Founder

class FoundersStep extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      address: "",
      tokens: 0,
      reputation: 0,
    }
    this.onAddFounder = this.onAddFounder.bind(this)
  }

  onAddFounder() {
    this.props.addFounder(this.state)
    this.setState({
      address: "",
      reputation: 0,
      tokens: 0,
    })
  }

  handleChange = (valueName: string) => (event: any) => {
    this.setState({ [valueName]: event.target.value } as any)
  }

  render() {
    const { addFounder, classes, founders } = this.props
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
