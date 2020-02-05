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
  const paramsNames = Object.keys(formState);

  return (
    <>
      {paramsNames.map((param: any, index: any) => {
        let currentParam = formState[param];
        let previousKey = paramsNames[index - 1];
        let previousParam = formState[previousKey];
        if (index <= 3) {
          return (
            <FormField
              field={currentParam}
              editable={editable}
              key={`genproto-field-${index}`}
            />
          );
        } else if (index % 2 !== 0) {
          return (
            <MDBRow key={`genproto-field-${index}`}>
              <FormField field={currentParam} editable={editable} />
              <FormField field={previousParam} editable={editable} />
            </MDBRow>
          );
        }
        return null;
      })}
    </>
  );
}
