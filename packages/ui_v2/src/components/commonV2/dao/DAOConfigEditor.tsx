import React from "react";
import { observer } from "mobx-react";
import { MDBRow } from "mdbreact";

import { DAOConfigForm } from "@dorgtech/daocreator-lib";
import FormField from "../FormField";

interface Props {
  form: DAOConfigForm;
  editable: boolean;
  checkError?: (error: any) => void;
  namingError: any;
}

function DAOConfigEditor(props: Props) {
  const { form, editable, checkError, namingError } = props;
  return (
    <MDBRow>
      <FormField
        field={form.$.daoName}
        editable={editable}
        tabIndex={1}
        checkError={checkError}
        namingError={namingError}
      />
      <FormField
        field={form.$.tokenSymbol}
        editable={editable}
        tabIndex={2}
        checkError={checkError}
        namingError={namingError}
      />
    </MDBRow>
  );
}

export default observer(DAOConfigEditor);
