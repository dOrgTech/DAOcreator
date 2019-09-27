import * as React from "react";
import {
  Card,
  CardContent,
  createStyles,
  Grid,
  Theme,
  Typography,
  withStyles,
  WithStyles,
  Button
} from "@material-ui/core";
import DAOConfigEditor from "components/common/dao/DAOConfigEditor";
import { DAOConfigForm, SimpleDAOConfigForm } from "lib/forms";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  form: DAOConfigForm | SimpleDAOConfigForm;
  updateConfig: any;
}

class NamingStep extends React.Component<Props> {
  render() {
    const { classes, form, updateConfig } = this.props;

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
                  <br />
                  Would you like to do it in expert mode?
                  <br />
                  {form instanceof SimpleDAOConfigForm ? (
                    <Button
                      variant={"contained"}
                      color={"secondary"}
                      onClick={updateConfig}
                    >
                      Expert mode
                    </Button>
                  ) : (
                    ""
                  )}
                </Typography>
              </Grid>
              <DAOConfigEditor form={form} editable={true} />
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
