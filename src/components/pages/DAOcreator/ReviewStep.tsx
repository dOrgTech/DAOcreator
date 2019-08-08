import * as React from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Grid
} from "@material-ui/core";
import SchemesEditor from "../../common/dao/SchemesEditor";
import DAOConfigEditor from "../../common/dao/DAOConfigEditor";
import MembersEditor from "../../common/dao/MembersEditor";
import { DAOForm } from "../../../lib/forms";

interface Props {
  form: DAOForm;
}

export default class ReviewStep extends React.Component<Props> {
  render() {
    const { form } = this.props;
    const getDAOTokenSymbol = () => form.$.config.$.tokenSymbol.value;

    return (
      <Card>
        <CardContent>
          <Typography variant="h4">Review your new DAO:</Typography>
          <Divider />
          <Grid container spacing={3} direction={"column"}>
            <Grid item>
              <Typography variant="h5" gutterBottom>
                Names
              </Typography>
              <Grid container justify={"center"}>
                <DAOConfigEditor form={form.$.config} editable={false} />
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="h5" gutterBottom>
                Schemes
              </Typography>
              <SchemesEditor form={form.$.schemes} editable={false} />
            </Grid>
            <Grid item>
              <Typography variant="h5" gutterBottom>
                Members
              </Typography>
              <MembersEditor
                form={form.$.members}
                editable={false}
                getDAOTokenSymbol={getDAOTokenSymbol}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}
