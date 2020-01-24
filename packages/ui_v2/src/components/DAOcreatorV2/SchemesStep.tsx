import * as React from "react";
import { Box } from "@chakra-ui/core";
import {
  SchemesForm,
  ContributionRewardForm,
  SchemeRegistrarForm
} from "@dorgtech/daocreator-lib";

import SchemeEditor from "../commonV2/dao/Schemes/SchemeEditor";

interface Props {
  form: SchemesForm;
  toggleCollapse: () => void;
  modal: boolean;
  setModal: any;
  daoSymbol: () => string;
}

function SchemesStep(props: Props) {
  const { form, toggleCollapse, modal, setModal, daoSymbol } = props;

  React.useEffect(() => {
    form.$.push(new ContributionRewardForm(), new SchemeRegistrarForm());
  }, []);

  return (
    <>
      <Box
        width={"100%"}
        borderBottomColor="#eaedf3"
        borderTopColor="#eaedf3"
        borderRightColor="#eaedf3"
        borderLeftColor="#eaedf3"
        rounded="lg"
      >
        <SchemeEditor
          form={form}
          editable={true}
          toggleCollapse={toggleCollapse}
          modal={modal}
          setModal={setModal}
          daoSymbol={daoSymbol}
        />{" "}
      </Box>
    </>
  );
}

export default SchemesStep;
