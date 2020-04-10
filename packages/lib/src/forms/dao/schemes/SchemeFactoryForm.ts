import { SchemeForm } from "../SchemeForm";
import { AnyField, GenesisProtocolForm } from "../..";
import {
  SchemeType,
  SchemeFactory,
  GenesisProtocol,
  GenesisProtocolPreset
} from "../../../state";

export class SchemeFactoryForm extends SchemeForm<
  SchemeFactory,
  {
    votingMachine: GenesisProtocolForm;
  }
> {
  constructor(form?: SchemeFactoryForm) {
    super(SchemeType.SchemeFactory, {
      votingMachine: form
        ? form.$.votingMachine
        : new GenesisProtocolForm({ preset: GenesisProtocolPreset.Critical })
    });

    this.setDisplayName("Plugin Manager");
    this.setDescription(
      "Manages post-creation adding/modifying/removing of plugins. Plugins add functionality to the DAO."
    );
  }

  public toState(): SchemeFactory {
    return new SchemeFactory(this.$.votingMachine.toState());
  }

  public fromState(state: SchemeFactory) {
    this.$.votingMachine.fromState(state.votingMachine as GenesisProtocol);
  }

  public getParams(): AnyField[] {
    return [];
  }
}
