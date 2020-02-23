import React, { FC } from "react";
import { observer } from "mobx-react";
import { MDBRow } from "mdbreact";

import { DAOConfigForm } from "@dorgtech/daocreator-lib";
import FormField from "../FormField";
import { NamingError } from "../../DAOcreatorV2/NamingStep";

interface Props {
  form: DAOConfigForm;
  editable: boolean;
  namingError: NamingError;
  checkError: (errors: NamingError) => void;
}

const DAOConfigEditor: FC<Props> = ({
  form,
  editable,
  namingError,
  checkError
}) => (
  <MDBRow>
    <FormField
      field={form.$.daoName}
      editable={editable}
      tabIndex={1}
      namingError={namingError}
      checkError={checkError}
    />
    <FormField
      field={form.$.tokenSymbol}
      editable={editable}
      tabIndex={2}
      namingError={namingError}
      checkError={checkError}
    />
  </MDBRow>
);

export default observer(DAOConfigEditor);
