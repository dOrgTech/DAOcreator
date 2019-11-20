import { Form } from "../../forms/Form";
import { StringField } from "../../forms";
import { DAOConfig } from "../../dependency/arc";
export declare class DAOConfigForm extends Form<
  DAOConfig,
  {
    daoName: StringField;
    tokenName: StringField;
    tokenSymbol: StringField;
  }
> {
  constructor(form?: DAOConfigForm);
  toState(): DAOConfig;
  fromState(state: DAOConfig): void;
}
