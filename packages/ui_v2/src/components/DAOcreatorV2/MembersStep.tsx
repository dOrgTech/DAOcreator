import * as React from "react";
import { observer } from "mobx-react";
import { MembersForm } from "@dorgtech/daocreator-lib";
import { AccordionSection, Table, Column } from "react-rainbow-components";
import { Grid, Box, Text, Progress, Input, Button } from "@chakra-ui/core";
// eslint-disable-next-line
interface Props {
  form: MembersForm;
  getDAOTokenSymbol: () => string;
}
const dummyData = [
  {
    member: "0x5Db06acd673531218B10430bA6dE9b69913Ad545",
    reputation: 50,
    token: 100
  },
  {
    member: "0x11bb17983E193A3cB0691505232331634B8FCa01",
    reputation: 30,
    token: 60
  },
  {
    member: "0x37Cc82371336Dc991527C31CE65da11Bd89A1e2B",
    reputation: 40,
    token: 80
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
          <Box>
            <Grid templateColumns="repeat(2, 1fr)" gap={2}>
              <Text fontSize="md">Reputation Distribution</Text>
              <Progress value={100} style={styles.distributionBar} />
            </Grid>
            <Grid templateColumns="repeat(2, 1fr)" gap={2}>
              <Text fontSize="md">DXD Token Distribution</Text>
              <Progress value={100} style={styles.distributionBar} />
            </Grid>
          </Box>

          <Box>
            <Grid templateColumns="repeat(2, 1fr)" gap={2}>
              <Input placeholder="0x..." />
              <Button
                variantColor="blue"
                variant="solid"
                style={styles.addMemberBtn}
              >
                Add Member
              </Button>
            </Grid>
          </Box>

          <Box>
            <Table data={dummyData} keyField="id">
              <Column header="Members" field="member" />
              <Column header="Reputation" field="reputation" />
              <Column header="Token" field="token" />
            </Table>
          </Box>
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
