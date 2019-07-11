import {
  withStyles,
  Typography,
  Theme,
  WithStyles,
  createStyles,
  Grid,
  Card,
  Button,
  CardContent,
} from "@material-ui/core"
import * as R from "ramda"
import * as React from "react"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import DAOcreatorActions, * as daoCreatorActions from "../../../lib/redux/actions/daoCreator"
import PieChart from "../../common/PieChart"
import EthAddressAvatar from "../../common/EthAddressAvatar"
import { FormField } from "../../common/FormField"
import { MembersForm, MemberForm } from "../../../lib/forms"

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  form: MembersForm
}

class FoundersStep extends React.Component<Props> {
  /*public getData(): DAOFounder {
    return this.toData()
  }

  private toData(): DAOFounder {
    const { form } = this.state
    return {
      address: form.getValue("address"),
      reputation: form.getValue("reputation"),
      tokens: form.getValue("tokens"),
    }
  }

  private onAddFounder() {
    const { actions } = this.props
    const { form } = this.state

    actions.addFounder(this.toData())
    actions.setStepIsValid(true)
    form.resetField("address")
    form.resetField("reputation")
    form.resetField("tokens")
  }

  private onRemoveFounder(addr: string) {
    this.props.actions.removeFounder(addr)
    this.props.actions.setStepIsValid(true)
  }

  render() {

    const { form } = this.props

    // Map our form to a founders data array
    const foundersData = form.$.map((founder: DAOFounderForm) => {
      const { address, tokens, reputation } = founder.$

      if (address.hasError) {
        return {
          address: "",
          tokens: 0,
          reputation: 0
        }
      } else {
        return {
          address: address.value,
          tokens: tokens.hasError ? 0 : tokens.value,
          reputation: reputation.hasError ? 0 : Number(reputation.value),
        }
      }
    })

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h4" className={classes.headline} gutterBottom>
            Add Founders
          </Typography>
          <Grid container spacing={16}>
            <Grid item xs={12} md={5}>
              <Typography className={classes.guideText} variant="body2">
                Here we specify the initial reputation and token distribution in
                the DAO.
                <br />
                <br />
                We do this by specifying the addresses together with the amount
                of reputation and tokens for each address.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="h6"
                className={classes.pieChartHeadlines}
                gutterBottom
              >
                Reputation Distribution
              </Typography>
              <PieChart
                data={foundersData}
                config={{
                  hight: 240,
                  width: 240,
                  dataKey: "reputation",
                  nameKey: "address",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="h6"
                className={classes.pieChartHeadlines}
                gutterBottom
              >
                Tokens Distribution
              </Typography>
              <PieChart
                data={foundersData}
                config={{
                  hight: 240,
                  width: 240,
                  dataKey: "tokens",
                  nameKey: "address",
                }}
              />
            </Grid>
            <Grid container spacing={16} className={classes.addLine}>
              <Grid item xs={6}>
                <FormField.Text form={form} />
              </Grid>
              <Grid item xs={2}>
                <FormField.Text field={"reputation"} form={form} />
              </Grid>
              <Grid item xs={2}>
                <FormField.Text field={"tokens"} form={form} />
              </Grid>
              <Grid item xs={1} className={classes.addButtonWrapper}>
                <Button
                  onClick={this.onAddFounder}
                  className={classes.addButton}
                  color="primary"
                  variant="contained"
                  aria-label="Add"
                  disabled={!formValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            {R.map(this.addedFounder, founders)}
          </Grid>
        </CardContent>
      </Card>
    )
  }

  addedFounder = ({ address, reputation, tokens }: DAOFounder) => (
    <Grid container spacing={16} key={`founder-${address}`}>
      <Grid item xs={1}>
        <EthAddressAvatar address={address} />
      </Grid>
      <Grid item xs={7}>
        <Typography>{address}</Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography>{reputation}</Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography>{tokens}</Typography>
      </Grid>
      <Grid item xs={2}>
        <Button onClick={() => this.onRemoveFounder(address)}>Delete</Button>
      </Grid>
    </Grid>
  )*/
}

// STYLE
const styles = (theme: Theme) =>
  createStyles({
    header: {},
    card: {},
    addButton: {},
    addLine: {
      marginBottom: 10,
      justifyContent: "center",
    },
    addButtonWrapper: {
      marginTop: "auto",
      marginRight: theme.spacing.unit,
    },
    subheader: {},
    headline: {},
    pieChartHeadlines: { textAlign: "center" },
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

export default withStyles(styles)(FoundersStep)
