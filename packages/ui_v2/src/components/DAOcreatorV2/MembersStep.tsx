import * as React from "react";
import { MembersForm } from "@dorgtech/daocreator-lib";
import { AccordionSection } from "react-rainbow-components";
import { MDBBox } from "mdbreact";

import MembersEditor from "components/commonV2/dao/Members/MembersEditor";

// eslint-disable-next-line
interface Props {
  form: MembersForm;
  getDAOTokenSymbol: () => string;
}

class MembersStep extends React.Component<Props> {
  state = {
    displayButtons: false
  };
  render() {
    const headerSection = true ? "3 Add Members" : "3 Members";
    return (
      <AccordionSection label={headerSection}>
        <MDBBox>
          <MembersEditor
            form={this.props.form}
            getDAOTokenSymbol={this.props.getDAOTokenSymbol}
          />
        </MDBBox>
      </AccordionSection>
    );
  }
}

export default MembersStep;
