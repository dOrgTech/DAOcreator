import * as React from "react";
import { observer } from "mobx-react";
import { MembersForm } from "@dorgtech/daocreator-lib";
import { AccordionSection, Table, Column } from "react-rainbow-components";
import { Grid, Box, Text, Progress, Input, Button } from "@chakra-ui/core";
import MembersEditor from "components/commonV2/dao/MembersEditor";
import MembersEditorV from "components/commonV2/MembersEditorV";

// eslint-disable-next-line
interface Props {
  form: MembersForm;
  getDAOTokenSymbol: () => string;
}
const dummyData = [
  {
    address: "0x5Db06acd673531218B10430bA6dE9b69913Ad545",
    reputation: 50,
    tokens: 100
  },
  {
    address: "0x11bb17983E193A3cB0691505232331634B8FCa01",
    reputation: 30,
    tokens: 60
  },
  {
    address: "0x37Cc82371336Dc991527C31CE65da11Bd89A1e2B",
    reputation: 40,
    tokens: 80
  }
];
@observer
class MembersStep extends React.Component<Props> {
  state = {
    displayButtons: false
  };
  render() {
    const headerSection = true ? "3 Add Members" : "3 Members";
    return (
      <AccordionSection label={headerSection}>
        <Box style={styles.container}>
          <MembersEditorV form={this.props.form} getDAOTokenSymbol={this.props.getDAOTokenSymbol} dummyData={dummyData}></MembersEditorV>
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
