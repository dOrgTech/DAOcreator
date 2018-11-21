import {
  Button,
  Card,
  CardActions,
  CardContent,
  createStyles,
  Grid,
  TextField,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core"
import * as R from "ramda"
import * as React from "react"

interface Props extends WithStyles<typeof styles> {
  onNext: (date: any) => void
}

type State = {
  daoName: string
  tokenName: string
  tokenSymbol: string
}

class Summary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      daoName: "",
      tokenName: "",
      tokenSymbol: "",
    }
    this.handleChange = this.handleChange.bind(this)
    this.clickNext = this.clickNext.bind(this)
  }

  handleChange = (valueName: string) => (event: any) => {
    this.setState({ [valueName]: event.target.value } as any)
  }

  clickNext() {
    this.props.onNext(
      R.pick(["daoName", "tokenName", "tokenSymbol"], this.state)
    )
  }

  render() {
    const { classes } = this.props
    return (
      <Card className={classes.card}>
        <form>
          <CardContent>
            <Typography variant="h5" className={classes.headline} gutterBottom>
              Create a DAO
            </Typography>
            <Grid container spacing={16}>
              <Grid item xs={6}>
                <Grid item xs={12}>
                  <TextField
                    className={classes.daoName}
                    id="daoName"
                    label="DAO Name"
                    value={this.state.daoName}
                    onChange={this.handleChange("daoName")}
                    margin="normal"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className={classes.tokenName}
                    id="token-name"
                    label="Token Name"
                    value={this.state.tokenName}
                    onChange={this.handleChange("tokenName")}
                    margin="normal"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className={classes.tokenSymbol}
                    id="token-symbol"
                    label="Token Sumbol"
                    value={this.state.tokenSymbol}
                    onChange={this.handleChange("tokenSymbol")}
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
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              className={classes.nextButton}
              onClick={this.clickNext}
            >
              Next
            </Button>
          </CardActions>
        </form>
      </Card>
    )
  }
}

const styles = ({  }: Theme) =>
  createStyles({
    card: {},
    headline: {},
    daoName: {},
    tokenName: {},
    tokenSymbol: {},
    nextButton: {},
  })

export default withStyles(styles)(Summary)
