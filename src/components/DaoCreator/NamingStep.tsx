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
import {
  setDaoName,
  setTokenName,
  setTokenSymbol,
} from "../../state/actions/daoCreator"
import * as React from "react"
import { connect } from "react-redux"

interface Props extends WithStyles<typeof styles> {
  daoName: string
  tokenName: string
  tokenSymbol: string
  setDaoName: (name: string) => void
  setTokenName: (name: string) => void
  setTokenSymbol: (symbol: string) => void
}

const handleChange = (method: any) => (event: any) => {
  console.log(`${method}`)
  console.log(`${event.target.value}`)
  method(event.target.value)
}

const NamingStep: React.SFC<Props> = ({
  daoName,
  tokenName,
  tokenSymbol,
  setDaoName,
  setTokenName,
  setTokenSymbol,
  classes,
}) => (
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
                value={daoName}
                onChange={handleChange(setDaoName)}
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
                value={tokenName}
                onChange={handleChange(setTokenName)}
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
                onChange={handleChange(setTokenSymbol)}
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
    daoName: state.daoCreator.daoName,
    tokenName: state.daoCreator.tokenName,
    tokenSymbol: state.daoCreator.tokenSymbol,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setDaoName: (name: string) => dispatch(setDaoName(name)),
    setTokenName: (name: string) => dispatch(setTokenName(name)),
    setTokenSymbol: (symbol: string) => dispatch(setTokenSymbol(symbol)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
