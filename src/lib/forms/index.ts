import { FieldState, FormState } from "formstate"
import {
  requiredText,
  validAddress,
  validBigNumber,
  validTokenSymbol,
  validName,
  requireElement,
} from "./validators"

export type StringField = FieldState<string>

export type DAOForm = FormState<{
  config: DAOConfigForm
  members: MembersForm
  schemes: SchemesForm
}>

export const CreateDAOForm = (): DAOForm =>
  new FormState({
    config: CreateDAOConfigForm(),
    members: CreateMembersForm(),
    schemes: CreateSchemesForm(),
  })

export type DAOConfigForm = FormState<{
  daoName: StringField
  tokenName: StringField
  tokenSymbol: StringField
}>

export const CreateDAOConfigForm = (): DAOConfigForm =>
  new FormState({
    daoName: new FieldState("").validators(requiredText, validName),

    tokenName: new FieldState("").validators(requiredText, validName),

    tokenSymbol: new FieldState("").validators(requiredText, validTokenSymbol),
  })

export type MembersForm = FormState<MemberForm[]>

export const CreateMembersForm = (): MembersForm =>
  new FormState([] as MemberForm[]).validators(requireElement("Member"))

export type MemberForm = FormState<{
  address: StringField
  reputation: StringField
  tokens: StringField
}>

export const CreateMemberForm = (): MemberForm =>
  new FormState({
    address: new FieldState("").validators(requiredText, validAddress),

    reputation: new FieldState("").validators(requiredText, validBigNumber),

    tokens: new FieldState("").validators(requiredText, validBigNumber),
  })

export type SchemeForm = FormState<{
  todo: StringField
}>

export const CreateSchemeForm = (): SchemeForm =>
  new FormState({
    todo: new FieldState(""),
  })

export type SchemesForm = FormState<SchemeForm[]>

export const CreateSchemesForm = (): SchemesForm =>
  new FormState([] as SchemeForm[]).validators(requireElement("Scheme"))
