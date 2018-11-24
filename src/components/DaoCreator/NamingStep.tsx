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

interface Props extends WithStyles<typeof styles> {}

type State = {
  daoName: string
  tokenName: string
  tokenSymbol: string
}

class NamingStep extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      daoName: "",
      tokenName: "",
      tokenSymbol: "",
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange = (valueName: string) => (event: any) => {
    this.setState({ [valueName]: event.target.value } as any)
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
const mapStateToProps = (state: any) => {
  return {}
}

const mapDispatchToProps = (dispatch: any) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
