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
import { RootState, DAOFounder } from "../../../lib/redux/state"
import DAOcreatorActions, * as daoCreatorActions from "../../../lib/redux/actions/daoCreator"
import PieChart from "../../common/PieChart"
import EthAddressAvatar from "../../common/EthAddressAvatar"
import { FormField } from "../../common/FormField"

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  founders: DAOFounder[]
  actions: DAOcreatorActions
}

interface State {
  form: any
  formValid: boolean
}

class FoundersStep extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.props.actions.setStepIsValid(false)
  }

  public onChange(): void {
    this.forceUpdate()
  }

  public onValidate(valid: boolean): void {
    this.setState({
      form: this.state.form,
      formValid: valid,
    })
  }

  public getData(): DAOFounder {
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

  // TODO: list of founders, manual entry, manual edit, import from csv
  /*  componentWillMount() {
    this.state.form.configureFields(
      {
        field: "address",
        config: {
          description: "Wallet Address",
          required: true,
          setValue: value => {
          },
          validator: (value: any) => {
            const err = FormValidation.isAddress(value)

            if (
              R.isEmpty(err) &&
              R.any(
                ({ address }) => R.equals(address, value),
                this.props.founders
              )
            ) {
              return "Founder already exists."
            }

            return err
          },
        },
      },
      {
        field: "reputation",
        config: {
          description: "Reputation",
          required: true,
          setValue: value => {
          },
          validator: FormValidation.isBigNumber,
        },
      },
      {
        field: "tokens",
        config: {
          description: "Tokens",
          required: true,
          setValue: value => {
          },
          validator: FormValidation.isBigNumber,
        },
      }
    )
  }*/

  render() {
    const { classes, founders } = this.props
    const { form, formValid } = this.state

    return (
      <></>
    ) /*
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
                data={founders}
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
                data={founders}
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
                <FormField.Text field={"address"} form={form} />
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
    )*/
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
  )
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

const componentWithStyles = withStyles(styles)(FoundersStep)

// STATE
const mapStateToProps = (state: RootState) => {
  return {
    founders: state.daoCreator.founders,
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
