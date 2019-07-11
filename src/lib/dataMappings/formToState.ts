import {
  DAOForm,
  DAOConfigForm,
  SchemeForm,
  SchemesForm,
  MemberForm,
  MembersForm,
} from "../forms"
import { DAOcreatorState, DAOConfig, Member, Scheme } from "../state"

export const DAOFormToState = (form: DAOForm): DAOcreatorState => ({
  config: DAOConfigFormToState(form.$.config),
  members: MembersFormToState(form.$.members),
  schemes: SchemesFormToState(form.$.schemes),
})

export const DAOConfigFormToState = (form: DAOConfigForm): DAOConfig => ({
  daoName: form.$.daoName.value,
  tokenName: form.$.tokenName.value,
  tokenSymbol: form.$.tokenSymbol.value,
})

export const MemberFormToState = (form: MemberForm): Member => ({
  address: form.$.address.value,
  tokens: form.$.tokens.value,
  reputation: form.$.reputation.value,
})

export const MembersFormToState = (form: MembersForm): Member[] =>
  form.$.map((member: MemberForm): Member => MemberFormToState(member))

export const SchemeFormToState = (form: SchemeForm): Scheme => ({
  // TODO
  id: "",
  typeName: "",
  params: {},
})

export const SchemesFormToState = (form: SchemesForm): Scheme[] =>
  form.$.map((scheme: SchemeForm): Scheme => SchemeFormToState(scheme))
