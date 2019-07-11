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
import * as R from "ramda"
import * as React from "react"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import {
  Member,
  getSchemeDefinition,
  SchemeConfig,
  votingMachineDefinitions,
} from "../../../lib/dependency/arc"
import { DAOcreatorState } from "../../../lib/state"
import EthAddressAvatar from "../../common/EthAddressAvatar"
import PieChart from "../../common/PieChart"

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  creator: DAOcreatorState
}

const ReviewStep: React.SFC<Props> = ({ creator, classes }) => (
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
            <Typography variant="h5" className={classes.headline} gutterBottom>
              Naming
            </Typography>
            <Typography>
              <b>DAO Name:</b> {creator.config.daoName}
            </Typography>
            <Typography>
              <b>Token Name:</b> {creator.config.tokenName}
            </Typography>
            <Typography>
              <b>Token Symbol:</b> {creator.config.tokenSymbol}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} md={7}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.headline} gutterBottom>
              Features
            </Typography>
            {R.map(displayScheme, creator.schemes)}
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
          {R.map(displayFounder, creator.members)}
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
            data={creator.members}
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
            data={creator.members}
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

const displayFounder = ({ address, reputation, tokens }: Member) => (
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

const displayScheme = (schemeConfig: SchemeConfig) => {
  const votingMachine =
    votingMachineDefinitions[
      R.pathOr(null, ["votingMachineConfig", "typeName"], schemeConfig.params)
    ]
  const schemeDefinition = getSchemeDefinition(schemeConfig.typeName)
  return (
    <Grid container spacing={16} key={`scheme-${schemeDefinition.typeName}`}>
      <Grid item xs={12}>
        <Typography variant="subtitle1">
          {schemeDefinition.displayName}
        </Typography>
        <Typography>
          <i>{schemeDefinition.description}</i>
        </Typography>
      </Grid>
      {votingMachine != null ? (
        <Grid item xs={12}>
          <Typography variant="subtitle2">
            {votingMachine.displayName}
          </Typography>
          <Typography>
            <i>{votingMachine.description}</i>
          </Typography>
        </Grid>
      ) : null}
    </Grid>
  )
}

// STYLE
const styles = (theme: Theme) =>
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
const mapStateToProps = (state: any) => ({
  creator: state.daoCreator,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
