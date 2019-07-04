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
import { bindActionCreators, Dispatch } from "redux"
import { RootState, DAOConfig } from "../../../state"
import { FormValidation, Form, FormCallbacks } from "../../../lib/forms"
import DAOcreatorActions, * as daoCreatorActions from "../../../redux/actions/daoCreator"
import { FormField } from "../../common/FormField"

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  config: DAOConfig
  actions: DAOcreatorActions
}

interface State {
  form: Form<DAOConfig>
}

class NamingStep extends React.Component<Props, State>
  implements FormCallbacks<DAOConfig> {
  state: Readonly<State> = {
    // TODO: move this all into a base component
    form: new Form<DAOConfig>(this),
  }

  constructor(props: Props) {
    super(props)
    this.props.actions.setStepIsValid(false)
  }

  public onChange(): void {
    this.forceUpdate()
  }

  public onValidate(valid: boolean): void {
    this.props.actions.setStepIsValid(valid)
  }

  public getData(): DAOConfig {
    return this.props.config
  }

  componentWillMount() {
    this.state.form.configureFields(
      {
        field: "daoName",
        config: {
          description: "DAO Name",
          required: true,
          setValue: value => this.props.actions.setDAOName(value),
          validator: FormValidation.isName,
        },
      },
      {
        field: "tokenName",
        config: {
          description: "Token Name",
          required: false,
          setValue: value => this.props.actions.setTokenName(value),
          validator: FormValidation.isName,
        },
      },
      {
        field: "tokenSymbol",
        config: {
          description: "Token Symbol",
          required: true,
          setValue: value => this.props.actions.setTokenSymbol(value),
          validator: FormValidation.isTokenSymbol,
        },
      }
    )
  }

  render() {
    const { classes } = this.props
    const { form } = this.state

    return (
      <Card className={classes.card}>
        <form>
          <CardContent>
            <Typography variant="h4" className={classes.headline} gutterBottom>
              Name the DAO
            </Typography>
            <Grid container spacing={16}>
              <Grid item xs={12} md={5}>
                <Typography className={classes.guideText} variant="body2">
                  Welcome!
                  <br />
                  You're about to start the process of creating a DAO
                  (Decentralized Autonomous Organization).
                  <br />
                  <br />
                  Let's start by giving a name to the DAO and its token.
                  <br />
                </Typography>
              </Grid>
              <Grid item xs={12} md={7}>
                <Grid item xs={12}>
                  <FormField.Text field={"daoName"} form={form} />
                </Grid>
                <Grid item xs={12}>
                  <FormField.Text field={"tokenName"} form={form} />
                </Grid>
                <Grid item xs={12}>
                  <FormField.Text field={"tokenSymbol"} form={form} />
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </form>
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

const componentWithStyles = withStyles(styles)(NamingStep)

// STATE
const mapStateToProps = (state: RootState) => {
  return {
    config: state.daoCreator.config,
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
