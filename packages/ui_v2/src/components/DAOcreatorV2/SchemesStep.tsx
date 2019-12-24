import * as React from "react";
import { AccordionSection } from "react-rainbow-components";
import { Box } from "@chakra-ui/core";
import { SchemesForm } from "@dorgtech/daocreator-lib";

import SchemeEditor from "../commonV2/dao/SchemeEditor";

interface Props {
  form: SchemesForm;
  nextStep: () => void;
}

function SchemesStep(props: Props) {
  const { form, nextStep } = props;
  const headerSection = true ? "2 Configure Organization" : "2 Configuration";
  return (
    <AccordionSection name="1" label={headerSection}>
      <Box
        width={"90%"}
        borderBottomColor="#eaedf3"
        borderTopColor="#eaedf3"
        borderRightColor="#eaedf3"
        borderLeftColor="#eaedf3"
        rounded="lg"
      >
        <SchemeEditor form={form} editable={true} nextStep={nextStep} />
      </Box>
    </AccordionSection>
  );
}

export default SchemesStep;
