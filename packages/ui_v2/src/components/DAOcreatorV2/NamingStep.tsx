import * as React from "react";
import { DAOConfigForm, DAOForm } from "@dorgtech/daocreator-lib";
import { AccordionSection } from "react-rainbow-components";
import DAOConfigEditor from "components/commonV2/dao/DAOConfigEditor";

// eslint-disable-next-line
interface Props {
  form: DAOConfigForm | any;
  daoForm: DAOForm | any;
  toReviewStep: () => void;
}

class NamingStep extends React.Component<Props> {
  render() {
    return (
      <>
        <DAOConfigEditor form={this.props.form} editable={true} />
      </>
    );
  }
}

export default NamingStep;
