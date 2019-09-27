import { Form } from "lib/forms/Form";
import {
  DAOConfigForm,
  MembersForm,
  SchemesForm,
  SimpleDAOConfigForm
} from "lib/forms";
import { DAOcreatorState, fromDAOMigrationParams } from "lib/state";
import { fromJSON, DAOMigrationParams } from "lib/dependency/arc";

export class DAOForm extends Form<
  DAOcreatorState,
  {
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
      config: this.$.config.toForm().toState(),
      members: this.$.members.toState(),
      schemes: this.$.schemes.toState()
    };
  }

  public fromState(state: DAOcreatorState) {
    const configForm = new DAOConfigForm();
    configForm.fromState(state.config);
    this.$.config.fromForm(configForm);
    this.$.members.fromState(state.members);
    this.$.schemes.fromState(state.schemes);
  }

  public async fromMigrationParamsFile(file: File): Promise<void> {
    const fileReader = new FileReader();
    fileReader.readAsText(file);

    await new Promise(
      (resolve, reject) => (fileReader.onloadend = () => resolve())
    );

    if (fileReader.result === null) {
      throw Error("Unaable to read file.");
    }

    const json = fileReader.result as string | ArrayBuffer;
    let params: DAOMigrationParams;

    if (typeof json === "string") {
      params = fromJSON(json as string);
    } else {
      const decoder = new TextDecoder();
      params = fromJSON(decoder.decode(json as ArrayBuffer));
    }

    this.fromState(fromDAOMigrationParams(params));
  }
}
