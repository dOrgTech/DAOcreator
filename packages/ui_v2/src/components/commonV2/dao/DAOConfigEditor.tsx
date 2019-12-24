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
      <MDBCol>
        <FormField field={form.$.daoName} editable={editable} />
      </MDBCol>
      <MDBCol>
        <MDBCol>
          <FormField field={form.$.tokenSymbol} editable={editable} />
        </MDBCol>
      </MDBCol>
    </MDBRow>
  );
}

export default observer(DAOConfigEditor);
