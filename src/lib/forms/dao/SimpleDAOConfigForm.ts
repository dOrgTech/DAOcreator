import { Form } from "lib/forms/Form";
import {
  StringField,
  requiredText,
  validTokenSymbol,
  validName
} from "lib/forms";
import { SimpleDAOConfig } from "lib/state";

export class SimpleDAOConfigForm extends Form<
  SimpleDAOConfig,
  {
    daoName: StringField;
    daoSymbol: StringField;
  }
> {
  constructor(form?: SimpleDAOConfig) {
    super({
      daoName: new StringField(form ? form.$.daoName.value : "")
        .validators(requiredText, validName)
        .setDisplayName("DAO Name")
        .setDescription("The name of the DAO."),
      daoSymbol: new StringField(form ? form.$.daoSymbol!.value : "")
        .validators(validTokenSymbol)
        .setDisplayName("DAO symbol")
        .setDescription("The symbol of the DAO.")
    });
  }

  public toState(): SimpleDAOConfig {
    return {
      daoName: this.$.daoName.value,
      daoSymbol: this.$.daoSymbol!.value
    };
  }

  public fromState(state: SimpleDAOConfig) {
    this.$.daoName.value = state.daoName;
    this.$.daoSymbol.value = state.daoSymbol;
  }
}
