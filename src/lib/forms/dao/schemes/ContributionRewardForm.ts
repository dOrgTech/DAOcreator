import { SchemeForm } from "lib/forms/dao/SchemeForm";
import { AnyField, GenesisProtocolForm } from "lib/forms";
import {
  SchemeType,
  ContributionReward,
  GenesisProtocol,
  GenesisProtocolPreset
} from "lib/state";

export class ContributionRewardForm extends SchemeForm<
  ContributionReward,
  {
    votingMachine: GenesisProtocolForm;
  }
> {
  constructor(form?: ContributionRewardForm) {
    super(SchemeType.ContributionReward, {
      votingMachine: form
        ? form.$.votingMachine
        : new GenesisProtocolForm({ preset: GenesisProtocolPreset.Normal })
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
