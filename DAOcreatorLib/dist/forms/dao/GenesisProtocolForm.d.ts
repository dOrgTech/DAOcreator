import { Form } from "../../forms/Form";
import {
  StringField,
  TokenField,
  DateTimeField,
  DurationField,
  AddressField,
  PercentageField
} from "../../forms";
import { GenesisProtocol } from "../../state";
import { GenesisProtocolPreset } from "../../dependency/arc";
export interface GenesisProtocolFormOpts {
  form?: GenesisProtocolForm;
  preset?: GenesisProtocolPreset;
}
export declare class GenesisProtocolForm extends Form<
  GenesisProtocol,
  {
    queuedVotePeriodLimit: DurationField;
    preBoostedVotePeriodLimit: DurationField;
    boostedVotePeriodLimit: DurationField;
    quietEndingPeriod: DurationField;
    queuedVoteRequiredPercentage: PercentageField;
    minimumDaoBounty: TokenField;
    daoBountyConst: StringField;
    thresholdConst: StringField;
    votersReputationLossRatio: PercentageField;
    proposingRepReward: TokenField;
    activationTime: DateTimeField;
    voteOnBehalf: AddressField;
  }
> {
  private _preset?;
  preset: GenesisProtocolPreset | undefined;
  constructor(opts: GenesisProtocolFormOpts);
  toState(): GenesisProtocol;
  fromState(state: GenesisProtocol): void;
}
