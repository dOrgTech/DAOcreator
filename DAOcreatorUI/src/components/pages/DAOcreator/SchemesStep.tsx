import * as React from "react";
import { observer } from "mobx-react";
import { Card, CardContent, Typography } from "@material-ui/core";
import SchemesEditor from "components/common/dao/SchemesEditor";
import { SchemesForm } from "@dorgtech/daocreatorlib";

interface Props {
  form: SchemesForm;
}

@observer
export default class SchemesStep extends React.Component<Props> {
  render() {
    const { form } = this.props;

    return (
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Add Schemes
          </Typography>
          <SchemesEditor form={form} editable={true} />
        </CardContent>
      </Card>
    );
  }
}
