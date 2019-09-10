import { ValidatableMapOrArray } from "formstate";
import { Form } from "lib/forms/Form";
import {
  DAOConfigForm,
  SimpleDAOConfigForm,
  MembersForm,
  SchemesForm
} from "lib/forms";
import { DAOcreatorState } from "lib/state";

export abstract class ExpertForm<
  StateType,
  T extends ValidatableMapOrArray
> extends Form<StateType, T> {
  public abstract toState(): StateType;
  public abstract fromState(state: StateType): void;
}

export abstract class SimpleForm<
  ExpertFormType extends ExpertForm<any, any>,
  T extends ValidatableMapOrArray
> extends Form<ExpertFormType, T> {
  public abstract toExpert(): ExpertFormType;
  public abstract fromExpert(state: ExpertFormType): void;
}

export class DAOForm extends ExpertForm<
  DAOcreatorState,
  {
    // TODO: properly implement simple mode
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
      config: this.$.config.toExpert().toState(),
      members: this.$.members.toState(),
      schemes: this.$.schemes.toState()
    };
  }

  public fromState(state: DAOcreatorState) {
    // WIP Need to make changes here.
    const expertConfig = new DAOConfigForm();
    expertConfig.fromState(state.config);
    this.$.config.fromExpert(expertConfig);
    // original below
    // this.$.members.fromState(state.config);
    this.$.members.fromState(state.members);
    this.$.schemes.fromState(state.schemes);
  }
}
