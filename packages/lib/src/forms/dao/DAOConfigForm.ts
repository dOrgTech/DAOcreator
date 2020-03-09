import { Form } from "../../forms/Form";
import {
  StringField,
  requiredText,
  validTokenSymbol,
  validName
} from "../../forms";
import { DAOConfig } from "../../dependency/arc";

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
        .setDescription(
          "Your organization’s name (cannot be changed after launch)."
        ),

      tokenName: new StringField(form ? form.$.tokenName.value : "")
        .validators(requiredText, validName)
        .setDisplayName("Token Name")
        .setDescription("The name of the DAO's token."),

      tokenSymbol: new StringField(form ? form.$.tokenSymbol.value : "")
        .validators(requiredText, validTokenSymbol)
        .setDisplayName("Token Symbol")
        .setDescription(
          "Abbreviation to identify your organization’s token (cannot be changed after launch)."
        )
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
