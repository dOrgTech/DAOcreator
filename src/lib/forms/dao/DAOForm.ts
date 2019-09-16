import { Form } from "lib/forms/Form";
import { DAOConfigForm, MembersForm, SchemesForm } from "lib/forms";
import { DAOcreatorState } from "lib/state";

export class DAOForm extends Form<
  DAOcreatorState,
  {
    config: DAOConfigForm;
    members: MembersForm;
    schemes: SchemesForm;
  }
> {
  constructor(form?: DAOForm) {
    const daoConfig = new DAOConfigForm(form ? form.$.config : undefined);
    const getDAOTokenSymbol = () => daoConfig.$.tokenSymbol.value;

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
      config: this.$.config.toState(),
      members: this.$.members.toState(),
      schemes: this.$.schemes.toState()
    };
  }

  public fromState(state: DAOcreatorState) {
    this.$.config.fromState(state.config);
    this.$.members.fromState(state.members);
    this.$.schemes.fromState(state.schemes);
  }
}
