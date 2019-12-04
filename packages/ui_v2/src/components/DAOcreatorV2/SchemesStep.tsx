import * as React from "react";
import { observer } from "mobx-react";
import { AccordionSection } from "react-rainbow-components";
import { Box, Button, Text, CheckboxGroup, Checkbox } from "@chakra-ui/core";
import { SchemesForm } from "@dorgtech/daocreator-lib";
// import SchemesEditor from "../common/dao/SchemesEditor";

interface Props {
  form: SchemesForm;
}

@observer
export default class SchemesStep extends React.Component<Props> {
  render() {
    // const { form } = this.props;
    const headerSection = true ? "2 Configure Organization" : "2 Configuration";
    return (
      <AccordionSection label={headerSection}>
        <Box
          width={"80%"}
          borderBottomColor="#eaedf3"
          borderTopColor="#eaedf3"
          borderRightColor="#eaedf3"
          borderLeftColor="#eaedf3"
          rounded="lg"
        >
          <Text fontSize="md">Recommend Configuration</Text>
          <Text fontSize="xs">
            Your proposal uses a proposal-vote structure and can securely scale
            to a big organisation
          </Text>
          <CheckboxGroup
            variantColor="green"
            defaultValue={["reward", "penalize", "autobet"]}
          >
            <Checkbox value="reward">
              Reward voters who side with the mayority
            </Checkbox>
            <Checkbox value="penalize">
              Penalize voters who side against the mayority
            </Checkbox>
            <Checkbox value="autobet">
              Auto-bet against every proposal to incentive curation of valuable
              proposals
            </Checkbox>
          </CheckboxGroup>
          <Button variantColor="blue" variant="solid">
            Set Configuration
          </Button>
        </Box>
      </AccordionSection>
    );
  }
}
