import * as React from "react";
import { observer } from "mobx-react";
import { AccordionSection } from "react-rainbow-components";
import { SchemesForm } from "@dorgtech/daocreator-lib";
// import SchemesEditor from "../common/dao/SchemesEditor";

interface Props {
  form: SchemesForm;
}

@observer
export default class SchemesStep extends React.Component<Props> {
  render() {
    const { form } = this.props;

    return (
      <AccordionSection
        label={true ? "2 Configure Organization" : "2 Configuration"}
      ></AccordionSection>
    );
  }
}
