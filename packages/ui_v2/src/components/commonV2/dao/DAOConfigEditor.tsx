import React from "react";
import { DAOConfigForm } from "@dorgtech/daocreator-lib";
import { MDBRow, MDBCol } from "mdbreact";
import FormField from "../FormField";
import { observer } from "mobx-react";

interface Props {
  form: DAOConfigForm;
  editable: boolean;
}

function DAOConfigEditor(props: Props) {
  const { form, editable } = props;
  return (
    <MDBRow>
      <FormField field={form.$.daoName} editable={editable} />
      <FormField field={form.$.tokenSymbol} editable={editable} />
    </MDBRow>
  );
}

export default observer(DAOConfigEditor);
