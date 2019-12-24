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
      <MDBCol style={styles.marginZero}>
        <label htmlFor="daoName" style={styles.labelStyle}>
          ORGANIZATION NAME
        </label>
        <FormField field={form.$.daoName} editable={editable} />
      </MDBCol>
      <MDBCol>
        <label htmlFor="daoSymbol" style={styles.labelStyle}>
          SYMBOL
        </label>
        <FormField field={form.$.tokenSymbol} editable={editable} />
      </MDBCol>
    </MDBRow>
  );
}

export default observer(DAOConfigEditor);

const styles = {
  labelStyle: {
    color: "gray",
    fontSize: "smaller",
    fontWeight: 400
  },
  marginZero: {
    margin: 0
  }
};
