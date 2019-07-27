import {
  DAOForm,
  DAOConfigForm,
  SchemeForm,
  SchemesForm,
  MemberForm,
  MembersForm,
  GenesisProtocolForm
} from "../forms";
import {
  DAOcreatorState,
  DAOConfig,
  Member,
  Scheme,
  GenesisProtocol
} from "../state";
import { TypeConversion } from "../dependency/web3";
const toBN = TypeConversion.toBN;

export const DAOFormToState = (form: DAOForm): DAOcreatorState => ({
  config: DAOConfigFormToState(form.$.config),
  members: MembersFormToState(form.$.members),
  schemes: SchemesFormToState(form.$.schemes)
});

export const DAOConfigFormToState = (form: DAOConfigForm): DAOConfig => ({
  daoName: form.$.daoName.value,
  tokenName: form.$.tokenName.value,
  tokenSymbol: form.$.tokenSymbol.value
});

export const MemberFormToState = (form: MemberForm): Member => ({
  address: form.$.address.value,
  tokens: toBN(form.$.tokens.value),
  reputation: toBN(form.$.reputation.value)
});

export const MembersFormToState = (form: MembersForm): Member[] =>
  form.$.map((member: MemberForm): Member => MemberFormToState(member));

export const GenesisProtocolFormToState = (
  form: GenesisProtocolForm
): GenesisProtocol =>
  new GenesisProtocol(
    toBN(form.$.queuedVoteRequiredPercentage.value),
    toBN(form.$.queuedVotePeriodLimit.value),
    toBN(form.$.thresholdConst.value),
    toBN(form.$.proposingRepReward.value), // TODO: convert
    toBN(form.$.minimumDaoBounty.value),
    toBN(form.$.boostedVotePeriodLimit.value),
    toBN(form.$.daoBountyConst.value),
    toBN(form.$.activationTime.value),
    toBN(form.$.preBoostedVotePeriodLimit.value),
    toBN(form.$.quietEndingPeriod.value),
    form.$.voteOnBehalf.value,
    toBN(form.$.votersReputationLossRatio.value)
  );

export const SchemeFormToState = (form: SchemeForm): Scheme => ({
  // TODO
  id: "",
  typeName: ""
});

export const SchemesFormToState = (form: SchemesForm): Scheme[] =>
  form.$.map((scheme: SchemeForm): Scheme => SchemeFormToState(scheme));
