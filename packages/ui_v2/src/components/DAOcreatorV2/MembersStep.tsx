import * as React from "react";
import { MembersForm } from "@dorgtech/daocreator-lib";
import { AccordionSection } from "react-rainbow-components";
import { Box } from "@chakra-ui/core";

import MembersEditor from "components/commonV2/dao/MembersEditor";

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
        <Box style={styles.container}>
          <MembersEditor
            form={this.props.form}
            getDAOTokenSymbol={this.props.getDAOTokenSymbol}
          />
        </Box>
      </AccordionSection>
    );
  }
}

const styles = {
  container: {
    maxWidth: 622
  },
  distributionBar: {
    width: 100
  },
  addMemberBtn: {
    marginLeft: "5em",
    width: 121
  }
};
export default MembersStep;
