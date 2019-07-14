import * as React from "react"
import {
  WithStyles,
  Theme,
  createStyles,
  withStyles,
  Grid,
  Typography,
} from "@material-ui/core"
import PieChart from "../PieChart"
import { Member } from "../../../lib/state"

interface Props extends WithStyles<typeof styles> {
  members: Member[]
}

class MembersAnalytics extends React.Component<Props> {
  render() {
    const { classes, members } = this.props

    return (
      <>
        <Grid item xs={12} sm={6} md={3}>
          <Typography
            variant="h6"
            className={classes.pieChartHeadlines}
            gutterBottom
          >
            Reputation Distribution
          </Typography>
          <PieChart
            data={members}
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
            data={members}
            config={{
              hight: 240,
              width: 240,
              dataKey: "tokens",
              nameKey: "address",
            }}
          />
        </Grid>
      </>
    )
  }
}

const styles = (theme: Theme) =>
  createStyles({
    pieChartHeadlines: {
      textAlign: "center",
    },
  })

export default withStyles(styles)(MembersAnalytics)
