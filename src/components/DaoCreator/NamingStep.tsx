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
import {
  addDaoName,
  addTokenName,
  addTokenSymbol,
} from "../../state/actions/daoCreator"

interface Props extends WithStyles<typeof styles> {
  daoName: string
  tokenName: string
  tokenSymbol: string
  addDaoName: (daoName: string) => void
  addTokenName: (tokenName: string) => void
  addTokenSymbol: (tokenSymbol: string) => void
}

type State = {
  daoName: string
  tokenName: string
  tokenSymbol: string
}

const initState: State = {
  daoName: "",
  tokenName: "",
  tokenSymbol: "",
}

// TODO: Reduxify all the things!!
// send to redux onBlure
class NamingStep extends React.Component<Props, State> {
  state: Readonly<State> = initState

  handleChange = (valueName: string) => (event: any) => {
    this.setState({ [valueName]: event.target.value } as any)
  }

  render() {
    const { addDaoName, addTokenName, addTokenSymbol, classes } = this.props

    const { daoName, tokenName, tokenSymbol } = this.state

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
                    id="daoName"
                    label="DAO Name"
                    value={daoName}
                    onChange={this.handleChange("daoName")}
                    margin="normal"
                    onBlur={() => addDaoName(daoName)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className={classes.tokenName}
                    id="token-name"
                    label="Token Name"
                    value={tokenName}
                    onChange={this.handleChange("tokenName")}
                    onBlur={() => addTokenName(tokenName)}
                    margin="normal"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className={classes.tokenSymbol}
                    id="token-symbol"
                    label="Token Symbol"
                    value={tokenSymbol}
                    onChange={this.handleChange("tokenSymbol")}
                    onBlur={() => addTokenSymbol(tokenSymbol)}
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
  return {
    daoName: state.daoCreator.naming.daoName,
    tokenName: state.daoCreator.naming.tokenName,
    tokenSymbol: state.daoCreator.naming.tokenSymbol,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    addDaoName: (daoName: string) => dispatch(addDaoName(daoName)),
    addTokenName: (tokenName: string) => dispatch(addTokenName(tokenName)),
    addTokenSymbol: (tokenSymbol: string) =>
      dispatch(addTokenSymbol(tokenSymbol)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
