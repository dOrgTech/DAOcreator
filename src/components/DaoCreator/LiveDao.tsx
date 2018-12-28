import {
  Card,
  CardContent,
  createStyles,
  Grid,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core"
import * as React from "react"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { AppState } from "../../AppState"
import { Founder, Schema, DAO } from "../../lib/integrations/daoStack/arc"

interface Props extends WithStyles<typeof styles> {
  dao: DAO | undefined
}

const LiveDaoStep: React.SFC<Props> = ({ dao, classes }) => {
  if (dao == null) {
    return (
      <Typography variant="h5" className={classes.headline} gutterBottom>
        No DAO
      </Typography>
    )
  } else {
    const {
      name,
      tokenName,
      tokenSymbol,
      avatarAddress,
      controllerAddress,
    } = dao
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h4" className={classes.headline} gutterBottom>
            Live DAO
          </Typography>
          <Grid container spacing={16}>
            <Grid item xs={6}>
              <Typography
                variant="h5"
                className={classes.headline}
                gutterBottom
              >
                DAO
              </Typography>
              <Typography>
                <b>Name:</b> {name}
              </Typography>
              <Typography>
                <b>Token Name:</b> {tokenName}
              </Typography>
              <Typography>
                <b>Token Symbol:</b> {tokenSymbol}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="h5"
                className={classes.headline}
                gutterBottom
              >
                Locations
              </Typography>
              <Typography>
                <b>Avatar address:</b> {avatarAddress}
              </Typography>
              <Typography>
                <b>Controller address:</b> {controllerAddress}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }
}
const displayFounder = ({ address, reputation, tokens }: Founder) => (
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

const displayScheme = ({ displayName, description, typeName }: Scheme) => (
  <Grid container spacing={16} key={`founder-${typeName}`}>
    <Grid item xs={12}>
      <Typography variant="subtitle1">{displayName}</Typography>
      <Typography>
        <i>{description}</i>
      </Typography>
    </Grid>
  </Grid>
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

const componentWithStyles = withStyles(styles)(LiveDaoStep)

// STATE
const mapStateToProps = (state: AppState) => {
  return {
    dao: state.daoCreator.deployedDao,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
