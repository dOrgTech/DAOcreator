import { Form } from "../../forms/Form";
import { DAOConfigForm, MembersForm, SchemesForm } from "../../forms";
import { DAOcreatorState, fromDAOMigrationParams } from "../../state";
import { fromJSON, DAOMigrationParams } from "../../dependency/arc";

export class DAOForm extends Form<
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
