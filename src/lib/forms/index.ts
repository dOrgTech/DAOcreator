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

export type DAOcreatorForm = FormState<{
  config: DAOConfigForm
  founders: DAOFoundersForm
  schemes: DAOSchemesForm
}>

export type DAOConfigForm = FormState<{
  daoName: StringField
  tokenName: StringField
  tokenSymbol: StringField
}>

export type DAOFounderForm = FormState<{
  address: StringField
  reputation: StringField
  tokens: StringField
}>

export type DAOFoundersForm = FormState<DAOFounderForm[]>

export type DAOSchemeForm = FormState<{
  todo: StringField
}>

export type DAOSchemesForm = FormState<DAOSchemeForm[]>

export const CreateDAOcreatorForm = (): DAOcreatorForm =>
  new FormState({
    config: CreateDAOConfigForm(),
    founders: CreateDAOFoundersForm(),
    schemes: CreateDAOSchemesForm(),
  })

export const CreateDAOConfigForm = (): DAOConfigForm =>
  new FormState({
    daoName: new FieldState("").validators(requiredText, validName),

    tokenName: new FieldState("").validators(requiredText, validName),

    tokenSymbol: new FieldState("").validators(requiredText, validTokenSymbol),
  })

export const CreateDAOFounderForm = (): DAOFounderForm =>
  new FormState({
    address: new FieldState("").validators(requiredText, validAddress),

    reputation: new FieldState("").validators(requiredText, validBigNumber),

    tokens: new FieldState("").validators(requiredText, validBigNumber),
  })

export const CreateDAOFoundersForm = (): DAOFoundersForm =>
  new FormState([] as DAOFounderForm[]).validators(requireElement("Founder"))

export const CreateDAOSchemeForm = (): DAOSchemeForm =>
  new FormState({
    todo: new FieldState(""),
  })

export const CreateDAOSchemesForm = (): DAOSchemesForm =>
  new FormState([] as DAOSchemeForm[]).validators(requireElement("Scheme"))
