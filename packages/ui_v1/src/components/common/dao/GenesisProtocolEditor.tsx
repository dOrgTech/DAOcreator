import * as React from "react";
import FormField from "components/common/FormField";
import { GenesisProtocolForm } from "@dorgtech/daocreatorlib";

interface Props {
  form: GenesisProtocolForm;
  editable: boolean;
}

export default class GenesisProtocolEditor extends React.Component<Props> {
  render() {
    const { form, editable } = this.props;
    const formState = form.$ as any;

    // TODO: make this the default behaviour of all form components
    // All editors should just be this, and the fields themselves should contain
    // a type. Then overrides can be made.
    return (
      <>
        {Object.keys(formState).map((propName: string, index: number) => (
          <FormField
            field={formState[propName]}
            editable={editable}
            key={`genproto-field-${index}`}
          />
        ))}
      </>
    );
  }
}
