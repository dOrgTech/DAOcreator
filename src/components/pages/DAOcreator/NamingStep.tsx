import * as React from "react";
import {
  Card,
  CardContent,
  createStyles,
  Grid,
  Theme,
  Typography,
  withStyles,
  WithStyles
} from "@material-ui/core";
import DAOConfigEditor from "components/common/dao/DAOConfigEditor";
import { ExpertDAOConfigForm, SimpleDAOConfigForm } from "lib/forms";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  form: ExpertDAOConfigForm | SimpleDAOConfigForm;
}

class NamingStep extends React.Component<Props> {
  render() {
    const { classes, form } = this.props;

    return (
      <Card>
        <form>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Name the DAO
            </Typography>
            <Grid container spacing={10}>
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
              {/*<DAOConfigEditor form={form} editable={true} />*/}
              <SimpleDAOConfigEditor form={form} editable={true} />
            </Grid>
          </CardContent>
        </form>
      </Card>
    );
  }
}

// STYLE
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

export default withStyles(styles)(NamingStep);
