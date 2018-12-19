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
  actions: DaoCreatorActions
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
    const { classes } = this.props
    const actions = this.props.actions

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
                    onBlur={() => actions.setName(daoName)}
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
                    onBlur={() => actions.setTokenName(tokenName)}
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
