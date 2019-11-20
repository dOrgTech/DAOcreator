import { SchemeForm } from "../../../forms/dao/SchemeForm";
import { AnyField, AddressField, GenesisProtocolForm } from "../../../forms";
import { GenericScheme } from "../../../state";
export declare class GenericSchemeForm extends SchemeForm<
  GenericScheme,
  {
    votingMachine: GenesisProtocolForm;
    contractToCall: AddressField;
  }
> {
  constructor(form?: GenericSchemeForm);
  toState(): GenericScheme;
  fromState(state: GenericScheme): void;
  getParams(): AnyField[];
}
