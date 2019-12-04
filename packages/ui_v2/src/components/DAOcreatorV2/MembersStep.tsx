import * as React from "react";
import { observer } from "mobx-react";
// import MembersEditor from "components/common/dao/MembersEditor";
// import MembersAnalytics from "components/common/dao/MembersAnalytics";
import { MembersForm } from "@dorgtech/daocreator-lib";
import { AccordionSection } from "react-rainbow-components";

// eslint-disable-next-line
interface Props {
  form: MembersForm;
  getDAOTokenSymbol: () => string;
}

@observer
class MembersStep extends React.Component<Props> {
  state = {
    displayButtons: false
  };
  render() {
    return (
      <AccordionSection
        label={true ? "3 Add Members" : "3 Members"}
      ></AccordionSection>
    );
  }
}

const styles = {};
export default MembersStep;
