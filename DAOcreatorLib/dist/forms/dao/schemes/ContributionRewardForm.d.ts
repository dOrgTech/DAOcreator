import { SchemeForm } from "../../../forms/dao/SchemeForm";
import { AnyField, GenesisProtocolForm } from "../../../forms";
import { ContributionReward } from "../../../state";
export declare class ContributionRewardForm extends SchemeForm<
  ContributionReward,
  {
    votingMachine: GenesisProtocolForm;
  }
> {
  constructor(form?: ContributionRewardForm);
  toState(): ContributionReward;
  fromState(state: ContributionReward): void;
  getParams(): AnyField[];
}
