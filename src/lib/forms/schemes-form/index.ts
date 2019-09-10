import { ValidatableMapOrArray } from "formstate";
import {
  GenesisProtocol,
  Scheme,
  GenericScheme,
  ContributionReward,
  SchemeRegistrar
} from "lib/state";
import { SchemeType, GenesisProtocolPreset } from "lib/dependency/arc";
import { AddressField, AnyField } from "lib/forms/field-types";
import { FriendlyForm } from "lib/forms/friendly-form";
import { GenesisProtocolForm } from "lib/forms/genesis-protocol-form";
import {
  requiredText,
  validAddress,
  requireElement,
  nonZeroAddress
} from "lib/forms//validators";

export abstract class SchemeForm<
  StateType extends Scheme,
  T extends ValidatableMapOrArray & { votingMachine: GenesisProtocolForm }
> extends FriendlyForm<StateType, T> {
  public abstract getParams(): AnyField[];

  private _type: SchemeType;

  get type() {
    return this._type;
  }

  constructor(type: SchemeType, $: T) {
    super($);
    this._type = type;
  }
}

export type AnySchemeForm =
  | GenericSchemeForm
  | ContributionRewardForm
  | SchemeRegistrarForm;

// TODO: support custom permissions
// TODO: support custom addresses / versions?
export class GenericSchemeForm extends SchemeForm<
  GenericScheme,
  {
    votingMachine: GenesisProtocolForm;
    contractToCall: AddressField;
  }
> {
  constructor(form?: GenericSchemeForm) {
    super(SchemeType.GenericScheme, {
      votingMachine: form ? form.$.votingMachine : new GenesisProtocolForm({}),

      contractToCall: new AddressField(
        form
          ? form.$.contractToCall.value
          : "0x0000000000000000000000000000000000000000"
      )
        .validators(requiredText, validAddress, nonZeroAddress)
        .setDisplayName("Contract Address")
        .setDescription("Address of the contract to call")
    });

    this.setDisplayName("Generic Scheme");
    this.setDescription(
      "A scheme for proposing and executing calls to an arbitrary function on a specific contract on behalf of the organization avatar."
    );
  }

  public toState(): GenericScheme {
    return new GenericScheme(
      this.$.contractToCall.value,
      this.$.votingMachine.toState()
    );
  }

  public fromState(state: GenericScheme) {
    this.$.contractToCall.value = state.contractToCall;
    // TODO: support multiple voting machine types
    this.$.votingMachine.fromState(state.votingMachine as GenesisProtocol);
  }

  public getParams(): AnyField[] {
    return [this.$.contractToCall];
  }
}

export class ContributionRewardForm extends SchemeForm<
  ContributionReward,
  {
    votingMachine: GenesisProtocolForm;
  }
> {
  constructor(form?: ContributionRewardForm) {
    super(SchemeType.ContributionReward, {
      votingMachine: form ? form.$.votingMachine : new GenesisProtocolForm({})
    });

    this.setDisplayName("Contribution Reward");
    this.setDescription(
      "Contributors can propose rewards for themselves and others. These rewards can be tokens, reputation, or a combination."
    );
  }

  public toState(): ContributionReward {
    return new ContributionReward(this.$.votingMachine.toState());
  }

  public fromState(state: ContributionReward) {
    this.$.votingMachine.fromState(state.votingMachine as GenesisProtocol);
  }

  public getParams(): AnyField[] {
    return [];
  }
}

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

export class SchemesForm extends FriendlyForm<Scheme[], AnySchemeForm[]> {
  constructor(form?: SchemesForm) {
    super(form ? form.$ : ([] as AnySchemeForm[]));

    this.validators(requireElement("Scheme"));
  }

  public toState(): Scheme[] {
    return this.$.map(
      (schemeForm: AnySchemeForm): Scheme => schemeForm.toState()
    );
  }

  public fromState(state: Scheme[]) {
    this.$ = state.map(scheme => {
      let schemeForm: AnySchemeForm;

      switch (scheme.type) {
        case SchemeType.ContributionReward:
          schemeForm = new ContributionRewardForm();
          schemeForm.fromState(scheme as ContributionReward);
          break;
        case SchemeType.SchemeRegistrar:
          schemeForm = new SchemeRegistrarForm();
          schemeForm.fromState(scheme as SchemeRegistrar);
          break;
        case SchemeType.GenericScheme:
          schemeForm = new GenericSchemeForm();
          schemeForm.fromState(scheme as GenericScheme);
          break;
        default:
          throw Error(`Unimplemented SchemeType ${SchemeType[scheme.type]}`);
      }

      return schemeForm;
    });
  }
}
