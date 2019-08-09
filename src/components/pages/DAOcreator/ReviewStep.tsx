import * as React from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Grid
} from "@material-ui/core";
import WarningIcon from "@material-ui/icons/WarningTwoTone";
import SchemesEditor from "../../common/dao/SchemesEditor";
import DAOConfigEditor from "../../common/dao/DAOConfigEditor";
import MembersEditor from "../../common/dao/MembersEditor";
import { DAOForm } from "../../../lib/forms";
import { SchemeType } from "../../../lib/state";

interface Props {
  form: DAOForm;
}

export default class ReviewStep extends React.Component<Props> {
  render() {
    const { form } = this.props;
    const { config, schemes, members } = form.$;
    const getDAOTokenSymbol = () => config.$.tokenSymbol.value;
    const missingSchemeReg =
      schemes.$.findIndex(
        scheme => scheme.type === SchemeType.SchemeRegistrar
      ) === -1;

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
                <DAOConfigEditor form={config} editable={false} />
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="h5" gutterBottom>
                Schemes
              </Typography>
              <SchemesEditor form={schemes} editable={false} />
              {missingSchemeReg ? (
                <Grid container direction={"row"}>
                  <WarningIcon color={"error"} />
                  <Typography color={"error"}>
                    Warning: Your DAO is missing a SchemeRegistrar, and will not
                    be able to modify itself once deployed. We highly recommend
                    adding this to your DAO.
                  </Typography>
                </Grid>
              ) : (
                <></>
              )}
            </Grid>
            <Grid item>
              <Typography variant="h5" gutterBottom>
                Members
              </Typography>
              <MembersEditor
                form={members}
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
