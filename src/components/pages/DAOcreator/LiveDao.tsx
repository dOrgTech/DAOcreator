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
import { DAO } from "../../../lib/integrations/arc"
import { RootState } from "../../../lib/redux/state"

// eslint-disable-next-line
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
    const { config, avatar, daoToken, reputation } = dao
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h4" className={classes.headline} gutterBottom>
            Live DAO
          </Typography>
          <Grid container spacing={16}>
            <Grid item xs={12} md={5}>
              <Typography className={classes.guideText} variant="body2">
                Hurray! Your DAO is deployed!
                <br />
                Here are some useful information about it.
                <br />
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography
                variant="h5"
                className={classes.headline}
                gutterBottom
              >
                DAO
              </Typography>
              <Typography>
                <b>Name:</b> {config.daoName}
              </Typography>
              <Typography>
                <b>Token Name:</b> {config.tokenName}
              </Typography>
              <Typography>
                <b>Token Symbol:</b> {config.tokenSymbol}
              </Typography>
              <Typography
                variant="h5"
                className={classes.headline}
                gutterBottom
              >
                Locations
              </Typography>
              <Typography>
                <b>Avatar:</b> {avatar}
              </Typography>
              <Typography>
                <b>DAO Token:</b> {daoToken}
              </Typography>
              <Typography>
                <b>Reputation:</b> {reputation}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }
}

// STYLE
const styles = (theme: Theme) =>
  createStyles({
    card: {},
    headline: {},
    daoName: {},
    tokenName: {},
    tokenSymbol: {},
    guideText: {
      fontSize: 18,
      maxWidth: 450,
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop: 50,
      paddingBottom: 50,
      margin: "auto",
    },
  })

const componentWithStyles = withStyles(styles)(LiveDaoStep)

// STATE
const mapStateToProps = (state: RootState) => {
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
