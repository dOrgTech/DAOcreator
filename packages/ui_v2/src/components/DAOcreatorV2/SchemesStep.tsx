import * as React from "react";
import { Box } from "@chakra-ui/core";
import {
  SchemesForm,
  ContributionRewardForm,
  SchemeRegistrarForm
} from "@dorgtech/daocreator-lib";

import SchemeEditor from "../commonV2/dao/SchemeEditor";

interface Props {
  form: SchemesForm;
  nextStep: () => void;
}

function SchemesStep(props: Props) {
  const { form, nextStep } = props;

  React.useEffect(() => {
    form.$.push(new ContributionRewardForm(), new SchemeRegistrarForm());
  }, [form.$]);

  const headerSection = true ? "2 Configure Organization" : "2 Configuration";
  return (
    <Box
      width={"100%"}
      borderBottomColor="#eaedf3"
      borderTopColor="#eaedf3"
      borderRightColor="#eaedf3"
      borderLeftColor="#eaedf3"
      rounded="lg"
    >
      <SchemeEditor form={form} editable={true} nextStep={nextStep} />
    </Box>
  );
}

export default SchemesStep;
