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
import { FormField } from "../../common/FormField"
import { DAOConfigForm } from "../../../lib/forms"

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  form: DAOConfigForm
}

class NamingStep extends React.Component<Props> {
  render() {
    const { classes, form } = this.props

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
                  <FormField.Text
                    id={"daoName"}
                    label={"DAO Name"}
                    field={form.$.daoName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormField.Text
                    id={"tokenName"}
                    label={"Token Name"}
                    field={form.$.tokenName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormField.Text
                    id={"tokenSymbol"}
                    label={"Token Symbol"}
                    field={form.$.tokenSymbol}
                  />
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

export default withStyles(styles)(NamingStep)
