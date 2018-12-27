import * as R from "ramda"
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
import {
  Founder,
  Scheme,
  VotingMachine,
  votingMachines,
  VotingMachineConfiguration,
} from "src/lib/integrations/daoStack/arc"

interface Props extends WithStyles<typeof styles> {
  daoName: string
  tokenName: string
  tokenSymbol: string
  founders: Founder[]
  schemes: Scheme[]
  votingMachineConfiguration: VotingMachineConfiguration
  stepNumber: number
  stepValide: boolean
}

const ReviewStep: React.SFC<Props> = ({
  daoName,
  tokenName,
  tokenSymbol,
  founders,
  schemes,
  votingMachineConfiguration,
  stepNumber,
  stepValide,
  classes,
}) => {
  const votingMachine = R.find(
    votingMachine =>
      votingMachine.typeName === votingMachineConfiguration.typeName,
    votingMachines
  ) as VotingMachine
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h4" className={classes.headline} gutterBottom>
          Review the DAO
        </Typography>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.headline} gutterBottom>
              Naming
            </Typography>
            <Typography>
              <b>DAO Name:</b> {daoName}
            </Typography>
            <Typography>
              <b>Token Name:</b> {tokenName}
            </Typography>
            <Typography>
              <b>Token Symbol:</b> {tokenSymbol}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h5" className={classes.headline} gutterBottom>
              Founders
            </Typography>
            <Grid container spacing={16} key={`founder-headline`}>
              <Grid item xs={6}>
                <Typography>
                  <b>Address</b>
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography>
                  <b>Reputation</b>
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography>
                  <b>Tokens</b>
                </Typography>
              </Grid>
            </Grid>
            {R.map(displayFounder, founders)}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h5" className={classes.headline} gutterBottom>
              Schemes
            </Typography>
            {R.map(displayScheme, schemes)}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h5" className={classes.headline} gutterBottom>
              Voting Machine
            </Typography>
            <Typography variant="subtitle1">
              {votingMachine.displayName}
            </Typography>
            <Typography>
              <i>{votingMachine.description}</i>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
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

const componentWithStyles = withStyles(styles)(ReviewStep)

// STATE
const mapStateToProps = (state: any) => {
  return {
    daoName: state.daoCreator.naming.daoName,
    tokenName: state.daoCreator.naming.tokenName,
    tokenSymbol: state.daoCreator.naming.tokenSymbol,
    founders: state.daoCreator.founders,
    schemes: state.daoCreator.schemes,
    votingMachineConfiguration: state.daoCreator.votingMachineConfiguration,
    stepNumber: state.daoCreator.step,
    stepValide: state.daoCreator.stepValidation[state.daoCreator.step],
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
