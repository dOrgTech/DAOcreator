import React from "react";
import { observer } from "mobx-react";
import { MDBRow } from "mdbreact";

import { DAOConfigForm } from "@dorgtech/daocreator-lib";
import FormField from "../FormField";

interface Props {
  form: DAOConfigForm;
  editable: boolean;
}

function DAOConfigEditor(props: Props) {
  const { form, editable } = props;
  return (
    <MDBRow>
      <FormField field={form.$.daoName} editable={editable} tabIndex={1} />
      <FormField field={form.$.tokenSymbol} editable={editable} tabIndex={2} />
    </MDBRow>
  );
}

export default observer(DAOConfigEditor);
