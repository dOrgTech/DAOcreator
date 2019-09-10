import { DAOcreatorState, DAOConfig } from "lib/state";
import {
  requiredText,
  validTokenSymbol,
  validName
} from "lib/forms/validators";

import { StringField } from "lib/forms/field-types";
import { FriendlyForm } from "lib/forms/friendly-form";
import { SchemesForm } from "lib/forms/schemes-form";
import { MembersForm } from "lib/forms/members-form";

export class DAOForm extends FriendlyForm<
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

export class DAOConfigForm extends FriendlyForm<
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
