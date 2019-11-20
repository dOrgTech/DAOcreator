import { Form } from "../../forms/Form";
import { DAOConfigForm, MembersForm, SchemesForm } from "../../forms";
import { DAOcreatorState } from "../../state";
export declare class DAOForm extends Form<
  DAOcreatorState,
  {
    config: DAOConfigForm;
    members: MembersForm;
    schemes: SchemesForm;
  }
> {
  constructor(form?: DAOForm);
  toState(): DAOcreatorState;
  fromState(state: DAOcreatorState): void;
  fromMigrationParamsFile(file: File): Promise<void>;
}
