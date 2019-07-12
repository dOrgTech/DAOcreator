// MembersStep
// MembersOverview
// MembersForm
// - member (editable) -> onAdd -> membersForm adds to members array
// - members -> member[]

import * as React from "react"
import {
  WithStyles,
  Theme,
  createStyles,
  withStyles,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core"
import MembersOverview from "../../common/dao/MembersOverview"
import { MembersForm } from "../../../lib/forms"
import { MembersFormToState } from "../../../lib/dataMappings/formToState"

interface Props extends WithStyles<typeof styles> {
  form: MembersForm
}

class MembersStep extends React.Component<Props> {
  render() {
    const { classes, form } = this.props
    const members = MembersFormToState(form)

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h4" className={classes.headline} gutterBottom>
            Add Members
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
            <MembersOverview members={members} />
            <MembersForm form={form} />
          </Grid>
        </CardContent>
      </Card>
    )
  }
}

const styles = (theme: Theme) =>
  createStyles({
    card: {},
    headline: {},
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

export default withStyles(styles)(MembersStep)
