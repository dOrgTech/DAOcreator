import { SchemeForm } from "../../../forms/dao/SchemeForm";
import { AnyField, GenesisProtocolForm } from "../../../forms";
import { SchemeRegistrar } from "../../../state";
export declare class SchemeRegistrarForm extends SchemeForm<
  SchemeRegistrar,
  {
    votingMachine: GenesisProtocolForm;
  }
> {
  constructor(form?: SchemeRegistrarForm);
  toState(): SchemeRegistrar;
  fromState(state: SchemeRegistrar): void;
  getParams(): AnyField[];
}
