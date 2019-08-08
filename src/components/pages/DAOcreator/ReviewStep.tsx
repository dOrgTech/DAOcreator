import * as React from "react";
import { observer } from "mobx-react";
import {
  WithStyles,
  Theme,
  createStyles,
  withStyles,
  Card,
  CardContent,
  Typography
} from "@material-ui/core";
import SchemesEditor from "../../common/dao/SchemesEditor";
import DAOConfigEditor from "../../common/dao/DAOConfigEditor";
import MembersEditor from "../../common/dao/MembersEditor";
import { DAOForm } from "../../../lib/forms";
import MembersAnalytics from "../../common/dao/MembersAnalytics";

interface Props extends WithStyles<typeof styles> {
  form: DAOForm;
}

class ReviewStep extends React.Component<Props> {
  render() {
    const { form } = this.props;
    const getDAOTokenSymbol = () => form.$.config.$.tokenSymbol.value;

    return (
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Naming
          </Typography>
          <DAOConfigEditor form={form.$.config} editable={false} />
          <Typography variant="h4" gutterBottom>
            Schemes
          </Typography>
          <SchemesEditor form={form.$.schemes} editable={false} />
          <Typography variant="h4" gutterBottom>
            Members
          </Typography>
          <MembersEditor
            form={form.$.members}
            editable={false}
            getDAOTokenSymbol={getDAOTokenSymbol}
          />
        </CardContent>
      </Card>
    );
  }
}

const styles = (theme: Theme) => createStyles({});

export default withStyles(styles)(ReviewStep);
