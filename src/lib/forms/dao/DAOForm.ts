import { Form } from "lib/forms/types";
import {
  DAOConfigForm,
  SimpleDAOConfigForm,
  MembersForm,
  SchemesForm
} from "lib/forms";
import { DAOcreatorState } from "lib/state";

export class DAOForm extends Form<
  DAOcreatorState,
  {
    config: SimpleDAOConfigForm;
    members: MembersForm;
    schemes: SchemesForm;
  }
> {
  constructor(form?: DAOForm) {
    const daoConfig = new SimpleDAOConfigForm(form ? form.$.config : undefined);
    const getDAOTokenSymbol = () => daoConfig.$.daoSymbol.value;

    super({
      config: daoConfig,
      members: new MembersForm(
        getDAOTokenSymbol,
        form ? form.$.members : undefined
      ),
      schemes: new SchemesForm(form ? form.$.schemes : undefined)
    });
  }

  public toState(): DAOcreatorState {
    return {
      config: this.$.config.toForm().toState(),
      members: this.$.members.toState(),
      schemes: this.$.schemes.toState()
    };
  }

  public fromState(state: DAOcreatorState) {
    const configForm = new DAOConfigForm();
    configForm.fromState(state.config);
    this.$.config.fromForm(configForm);
    this.$.members.fromState(state.members);
    this.$.schemes.fromState(state.schemes);
  }
}
