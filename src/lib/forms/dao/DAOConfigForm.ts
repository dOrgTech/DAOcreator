import { Form } from "lib/forms/Form";
import {
  StringField,
  requiredText,
  validTokenSymbol,
  validName
} from "lib/forms";
import { DAOConfig } from "lib/state";
import { SimpleForm } from "lib/forms";

export class DAOConfigForm extends Form<
  DAOConfig,
  {
    daoName: StringField;
    tokenName: StringField;
    tokenSymbol: StringField;
  }
> {
  constructor(form?: DAOConfigForm) {
    super({
      daoName: new StringField(form ? form.$.daoName.value : "")
        .validators(requiredText, validName)
        .setDisplayName("DAO Name")
        .setDescription("The name of the DAO."),

      tokenName: new StringField(form ? form.$.tokenName.value : "")
        .validators(requiredText, validName)
        .setDisplayName("Token Name")
        .setDescription("The name of the DAO's token."),

      tokenSymbol: new StringField(form ? form.$.tokenSymbol.value : "")
        .validators(requiredText, validTokenSymbol)
        .setDisplayName("Token Symbol")
        .setDescription("The token's 4 letter symbol for exchanges.")
    });
  }

  public toState(): DAOConfig {
    return {
      daoName: this.$.daoName.value,
      tokenName: this.$.tokenName.value,
      tokenSymbol: this.$.tokenSymbol.value
    };
  }

  public fromState(state: DAOConfig) {
    this.$.daoName.value = state.daoName;
    this.$.tokenName.value = state.tokenName;
    this.$.tokenSymbol.value = state.tokenSymbol;
  }
}

export class SimpleDAOConfigForm extends SimpleForm<
  DAOConfigForm,
  {
    daoName: StringField;
    daoSymbol: StringField;
  }
> {
  public fromState(): void {}
  // getting error here without this function.
  public toState(): DAOConfigForm {
    throw new Error("Method not implemented.");
  }
  constructor(form?: SimpleDAOConfigForm) {
    super({
      daoName: new StringField(form ? form.$.daoName.value : "")
        .validators(requiredText, validName)
        .setDisplayName("DAO Name")
        .setDescription("The name of the DAO."),

      daoSymbol: new StringField(form ? form.$.daoSymbol.value : "")
        .validators(requiredText, validTokenSymbol)
        .setDisplayName("DAO Symbol")
        .setDescription("The DAO's 4 letter symbol.")
    });
  }

  public toExpert(): DAOConfigForm {
    const form = new DAOConfigForm();
    form.$.daoName.value = this.$.daoName.value;
    form.$.tokenName.value = this.$.daoName.value;
    form.$.tokenSymbol.value = this.$.daoSymbol.value;
    return form;
  }
  /// WIP here we need to set the simple inputs based from expert. Need to make some change here
  public fromExpert(state: DAOConfigForm): SimpleDAOConfigForm {
    const form = new SimpleDAOConfigForm();
    form.$.daoName.value = this.$.daoName.value;
    form.$.daoSymbol.value = this.$.daoSymbol.value;
    return form;
  }
}
