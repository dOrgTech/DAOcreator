import * as React from "react";
import { observer } from "mobx-react";
import { observable, IObservableObject } from "mobx";

import SchemeEditor from "./SchemeEditor";
import {
  SchemesForm,
  AnySchemeForm,
  GenericSchemeForm,
  ContributionRewardForm,
  SchemeRegistrarForm,
  SchemeType
} from "@dorgtech/daocreator-lib";

// eslint-disable-next-line
interface Props {
  form: SchemesForm;
  editable: boolean;
}

@observer
class SchemesEditor extends React.Component<Props> {
  fillers: { [type: number]: AnySchemeForm & IObservableObject } = {};

  constructor(props: Props) {
    super(props);

    this.fillers[SchemeType.ContributionReward] = observable(
      new ContributionRewardForm()
    );
    this.fillers[SchemeType.SchemeRegistrar] = observable(
      new SchemeRegistrarForm()
    );
    this.fillers[SchemeType.GenericScheme] = observable(
      new GenericSchemeForm()
    );
  }

  render() {
    const { form, editable } = this.props;

    return (
      <>
        <SchemeEditor
          form={form}
          editable={editable}
          enabled={true}
          onToggle={(toggled: boolean) => {}}
        />
      </>
    );
  }
}

export default SchemesEditor;
