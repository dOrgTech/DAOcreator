import * as React from "react";
import { observer } from "mobx-react";
import { AccordionSection } from "react-rainbow-components";
import { Box, Button } from "@chakra-ui/core";
import { SchemesForm } from "@dorgtech/daocreator-lib";

import SchemesEditor from "../commonV2/dao/SchemesEditor";

interface Props {
  form: SchemesForm;
}

@observer
export default class SchemesStep extends React.Component<Props> {
  render() {
    const { form } = this.props;
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
          <SchemesEditor form={form} editable={true} />
        </Box>
      </AccordionSection>
    );
  }
}