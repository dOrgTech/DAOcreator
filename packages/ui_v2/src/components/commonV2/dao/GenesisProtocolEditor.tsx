import * as React from "react";
import { GenesisProtocolForm } from "@dorgtech/daocreator-lib";
import FormField from "../FormField";
import { MDBRow } from "mdbreact";

interface Props {
  form: GenesisProtocolForm;
  editable: boolean;
}

export default function GenesisProtocolEditor(props: Props) {
  const { form, editable } = props;
  const formState = form.$ as any;

  const votingMachingParamsList: Array<any> = [];
  let paramsNames = Object.keys(formState);
  let i: any;
  for (i in paramsNames) {
    let key = paramsNames[i];
    let field = formState[key];
    let secondKey = i == 7 ? paramsNames[10] : paramsNames[i - 1];
    let secondField = formState[secondKey];
    if (i <= 3 || i > 10) {
      votingMachingParamsList.push(
        <FormField
          field={field}
          editable={editable}
          key={`genproto-field-${i}`}
        />
      );
    } else {
      if (i % 2 == 0) continue;
      votingMachingParamsList.push(
        <MDBRow key={`genproto-field-${i}`}>
          <FormField field={field} editable={editable} />
          <FormField field={secondField} editable={editable} />
        </MDBRow>
      );
    }
  }

  return <>{votingMachingParamsList.map(param => param)}</>;
}
