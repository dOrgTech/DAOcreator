import * as React from "react";
import {
  WithStyles,
  Theme,
  createStyles,
  withStyles,
  Grid,
  Typography
} from "@material-ui/core";
import QuestionIcon from "@material-ui/icons/HelpOutline";
import PieChart from "../PieChart";
import { Member } from "../../../lib/state";

interface Props extends WithStyles<typeof styles> {
  data: Member[];
}

class MembersAnalytics extends React.Component<Props> {
  render() {
    const { classes, data } = this.props;

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
          {data.length > 0 ? (
            <PieChart
              data={data}
              config={{
                hight: 240,
                width: 240,
                dataKey: "reputation",
                nameKey: "address"
              }}
            />
          ) : (
            <QuestionIcon color={"primary"} className={classes.questionIcon} />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography
            variant="h6"
            className={classes.pieChartHeadlines}
            gutterBottom
          >
            Tokens Distribution
          </Typography>
          {data.length > 0 ? (
            <PieChart
              data={data}
              config={{
                hight: 240,
                width: 240,
                dataKey: "tokens",
                nameKey: "address"
              }}
            />
          ) : (
            <QuestionIcon color={"primary"} className={classes.questionIcon} />
          )}
        </Grid>
      </>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    pieChartHeadlines: {
      textAlign: "center"
    },
    questionIcon: {
      width: "100%",
      height: "75%",
      alignSelf: "center"
    }
  });

export default withStyles(styles)(MembersAnalytics);
