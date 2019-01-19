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
} from "../../lib/integrations/daoStack/arc"
import PieChart from "../common/PieChart"
import EthAddressAvatar from "../common/EthAddressAvatar"

interface Props extends WithStyles<typeof styles> {
  daoName: string
  tokenName: string
  tokenSymbol: string
  founders: Founder[]
  schemes: Scheme[]
  votingMachineConfiguration: VotingMachineConfiguration
  stepNumber: number
  stepValid: boolean
}

const ReviewStep: React.SFC<Props> = ({
  daoName,
  tokenName,
  tokenSymbol,
  founders,
  schemes,
  votingMachineConfiguration,
  stepNumber,
  stepValid,
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
          <Grid item xs={12} md={5}>
            <Typography className={classes.guideText} variant="body2">
              Look over this summary of the DAO you are about to create
            </Typography>
          </Grid>
          <Grid item xs={12} md={7} />
          <Grid item xs={12} md={5}>
            <Grid item xs={12}>
              <Typography
                variant="h5"
                className={classes.headline}
                gutterBottom
              >
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
              <Typography
                variant="h5"
                className={classes.headline}
                gutterBottom
              >
                Voting
              </Typography>
              <Typography variant="subtitle1">
                {votingMachine.displayName}
              </Typography>
              <Typography>
                <i>{votingMachine.description}</i>
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} md={7}>
            <Grid item xs={12}>
              <Typography
                variant="h5"
                className={classes.headline}
                gutterBottom
              >
                Features
              </Typography>
              {R.map(displayScheme, schemes)}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.headline} gutterBottom>
              Founders
            </Typography>
            <Grid container spacing={16} key={`founder-headline`}>
              <Grid item xs={1} />
              <Grid item xs={7}>
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
        </Grid>
        <Grid container spacing={16}>
          <Grid item xs={6} sm={6} md={6}>
            <Typography
              variant="h6"
              className={classes.pieChartHeading}
              gutterBottom
            >
              Reputation Distribution
            </Typography>
            <PieChart
              data={founders}
              config={{
                hight: 240,
                width: 240,
                dataKey: "reputation",
                nameKey: "address",
              }}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            <Typography
              variant="h6"
              className={classes.pieChartHeading}
              gutterBottom
            >
              Tokens Distribution
            </Typography>
            <PieChart
              data={founders}
              config={{
                hight: 240,
                width: 240,
                dataKey: "tokens",
                nameKey: "address",
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

const displayFounder = ({ address, reputation, tokens }: Founder) => (
  <Grid container spacing={16} key={`founder-${address}`}>
    <Grid item xs={1}>
      <EthAddressAvatar address={address} />
    </Grid>
    <Grid item xs={7}>
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
    headline: {
      paddingTop: 20,
    },
    daoName: {},
    tokenName: {},
    tokenSymbol: {},
    guideText: {
      fontSize: 18,
      maxWidth: 450,
      addingTop: 50,
      paddingBottom: 20,
    },
    pieChartHeading: {
      textAlign: "center",
    },
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
    stepValid: state.daoCreator.stepValidation[state.daoCreator.step],
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
