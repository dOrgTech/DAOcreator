import { Form } from "lib/forms/Form";
import {
  StringField,
  requiredText,
  validTokenSymbol,
  validName
} from "lib/forms";
import { DAOConfig } from "lib/state";

export class DAOConfigForm extends Form<
  DAOConfig,
  {
    expertConfig?: any;
    simpleConfig?: any;
  }
> {
  constructor(form?: DAOConfigForm) {
    super({
      expertConfig: {
        daoName: new StringField(form ? form.$.expertConfig!.daoName.value : "")
          .validators(requiredText, validName)
          .setDisplayName("DAO Name")
          .setDescription("The name of the DAO."),

        tokenName: new StringField(
          form ? form.$.expertConfig!.tokenName.value : ""
        )
          .validators(requiredText, validName)
          .setDisplayName("Token Name")
          .setDescription("The name of the DAO's token."),

        tokenSymbol: new StringField(
          form ? form.$.expertConfig!.tokenSymbol.value : ""
        )
          .validators(requiredText, validTokenSymbol)
          .setDisplayName("Token Symbol")
          .setDescription("The token's 4 letter symbol for exchanges.")
      },
      simpleConfig: {
        daoName: new StringField(form ? form.$.simpleConfig!.daoName.value : "")
          .validators(requiredText, validName)
          .setDisplayName("DAO Name")
          .setDescription("The name of the DAO."),

        daoSymbol: new StringField(
          form ? form.$.simpleConfig!.daoSymbol.value : ""
        )
          .validators(requiredText, validName)
          .setDisplayName("DAO symbol")
          .setDescription("The symbol of the DAO.")
      }
    });
  }

  public toState(): DAOConfig {
    if (this.$.expertConfig) {
      return {
        simpleConfig: {
          daoName: this.$.simpleConfig.daoName.value,
          daoSymbol: this.$.simpleConfig.daoSymbol.value
        }
      };
    } else {
      return {
        expertConfig: {
          daoName: this.$.expertConfig.daoName.value,
          tokenName: this.$.expertConfig.tokenName.value,
          tokenSymbol: this.$.expertConfig.tokenSymbol.value
        }
      };
    }
  }

  public fromState(state: DAOConfig) {
    if (state.expertConfig) {
      this.$.expertConfig.daoName.value = state.expertConfig!.daoName;
      this.$.expertConfig.tokenName.value = state.expertConfig!.tokenName;
      this.$.expertConfig.tokenSymbol.value = state.expertConfig!.tokenSymbol;
    } else {
      this.$.simpleConfig.daoName.value = state.simpleConfig!.daoName;
      this.$.simpleConfig.daoSymbol.value = state.simpleConfig!.daoSymbol;
    }
  }
}
