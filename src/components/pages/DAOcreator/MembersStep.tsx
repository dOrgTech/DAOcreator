import * as React from "react";
import { observer } from "mobx-react";
import {
  WithStyles,
  Theme,
  createStyles,
  withStyles,
  Card,
  CardContent,
  Grid,
  Typography
} from "@material-ui/core";
import MembersEditor from "components/common/dao/MembersEditor";
import MembersAnalytics from "components/common/dao/MembersAnalytics";
import { MembersForm } from "lib/forms";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  form: MembersForm;
  getDAOTokenSymbol: () => string;
}

@observer
class MembersStep extends React.Component<Props> {
  render() {
    const { classes, form, getDAOTokenSymbol } = this.props;

    return (
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Add Members
          </Typography>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Typography className={classes.guideText} variant="body2">
                Here we specify the initial reputation and token distribution in
                the DAO.
                <br />
                <br />
                We do this by specifying the addresses together with the amount
                of reputation and tokens for each address.
              </Typography>
            </Grid>
            <MembersAnalytics data={form.toState()} />
            <MembersEditor
              getDAOTokenSymbol={getDAOTokenSymbol}
              form={form}
              editable={true}
              maxScrollHeight={"20rem"}
            />
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    guideText: {
      fontSize: 18,
      maxWidth: 450,
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop: 50,
      paddingBottom: 50,
      margin: "auto"
    }
  });

export default withStyles(styles)(MembersStep);
