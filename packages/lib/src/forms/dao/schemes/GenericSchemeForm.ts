import { SchemeForm } from "../../../forms/dao/SchemeForm";
import {
  AnyField,
  AddressField,
  GenesisProtocolForm,
  requiredText,
  validAddress,
  nonZeroAddress
} from "../../../forms";
import {
  SchemeType,
  GenericScheme,
  GenesisProtocol,
  GenesisProtocolPreset
} from "../../../state";

export class GenericSchemeForm extends SchemeForm<
  GenericScheme,
  {
    votingMachine: GenesisProtocolForm;
    contractToCall: AddressField;
  }
> {
  constructor(form?: GenericSchemeForm) {
    super(SchemeType.GenericScheme, {
      votingMachine: form
        ? form.$.votingMachine
        : new GenesisProtocolForm({ preset: GenesisProtocolPreset.Normal }),

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
    this.$.votingMachine.fromState(state.votingMachine as GenesisProtocol);
  }

  public getParams(): AnyField[] {
    return [this.$.contractToCall];
  }
}
