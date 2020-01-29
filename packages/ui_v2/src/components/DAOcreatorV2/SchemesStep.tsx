import * as React from "react";
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
  advancedScheme: any;
  daoSymbol: () => string;
}

function SchemesStep(props: Props) {
  const { form, toggleCollapse, modal, setModal, advancedScheme } = props;

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!loading) return;
    setLoading(false);

    form.$.push(new ContributionRewardForm(), new SchemeRegistrarForm());
  }, [loading, form.$]);

  return (
    <SchemeEditor
      form={form}
      editable={true}
      toggleCollapse={toggleCollapse}
      modal={modal}
      setModal={setModal}
      advancedScheme={advancedScheme}
    />
  );
}

export default SchemesStep;
