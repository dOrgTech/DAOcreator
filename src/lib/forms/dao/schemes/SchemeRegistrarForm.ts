import { SchemeForm } from "lib/forms/dao/SchemeForm";
import { AnyField, GenesisProtocolForm } from "lib/forms";
import {
  SchemeType,
  SchemeRegistrar,
  GenesisProtocol,
  GenesisProtocolPreset
} from "lib/state";

export class SchemeRegistrarForm extends SchemeForm<
  SchemeRegistrar,
  {
    votingMachine: GenesisProtocolForm;
  }
> {
  constructor(form?: SchemeRegistrarForm) {
    super(SchemeType.SchemeRegistrar, {
      votingMachine: form
        ? form.$.votingMachine
        : new GenesisProtocolForm({ preset: GenesisProtocolPreset.Critical })
    });

    this.setDisplayName("Scheme Registrar");
    this.setDescription(
      "Manages post-creation adding/modifying and removing of schemes. Schemes add functionality to the DAO."
    );
  }

  public toState(): SchemeRegistrar {
    return new SchemeRegistrar(this.$.votingMachine.toState());
  }

  public fromState(state: SchemeRegistrar) {
    // TODO: support multiple voting machine types
    this.$.votingMachine.fromState(state.votingMachine as GenesisProtocol);
  }

  public getParams(): AnyField[] {
    return [];
  }
}
