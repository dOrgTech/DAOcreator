import { FieldState, FormState } from "formstate";
import {
  requiredText,
  validAddress,
  validBigNumber,
  validTokenSymbol,
  validName,
  requireElement,
  noDuplicates
} from "./validators";

export type StringField = FieldState<string>;

export type DAOForm = FormState<{
  config: DAOConfigForm;
  members: MembersForm;
  schemes: SchemesForm;
}>;

export const CreateDAOForm = (form?: DAOForm): DAOForm =>
  new FormState({
    config: CreateDAOConfigForm(form ? form.$.config : undefined),
    members: CreateMembersForm(form ? form.$.members : undefined),
    schemes: CreateSchemesForm(form ? form.$.schemes : undefined)
  });

export type DAOConfigForm = FormState<{
  daoName: StringField;
  tokenName: StringField;
  tokenSymbol: StringField;
}>;

export const CreateDAOConfigForm = (form?: DAOConfigForm): DAOConfigForm =>
  new FormState({
    daoName: new FieldState(form ? form.$.daoName.value : "").validators(
      requiredText,
      validName
    ),

    tokenName: new FieldState(form ? form.$.tokenName.value : "").validators(
      requiredText,
      validName
    ),

    tokenSymbol: new FieldState(
      form ? form.$.tokenSymbol.value : ""
    ).validators(requiredText, validTokenSymbol)
  });

export type MembersForm = FormState<MemberForm[]>;

export const CreateMembersForm = (form?: MembersForm): MembersForm =>
  new FormState(form ? form.$.map(value => value) : ([] as MemberForm[]))
    .validators(requireElement("Member"))
    .validators(
      noDuplicates(
        (a: MemberForm, b: MemberForm) =>
          a.$.address.value === b.$.address.value
      )
    );

export type MemberForm = FormState<{
  address: StringField;
  reputation: StringField;
  tokens: StringField;
}>;

export const CreateMemberForm = (form?: MemberForm): MemberForm =>
  new FormState({
    address: new FieldState(form ? form.$.address.value : "").validators(
      requiredText,
      validAddress
    ),

    reputation: new FieldState(form ? form.$.reputation.value : "").validators(
      requiredText,
      validBigNumber
    ),

    tokens: new FieldState(form ? form.$.tokens.value : "").validators(
      requiredText,
      validBigNumber
    )
  });

export type SchemesForm = FormState<SchemeForm[]>;

export const CreateSchemesForm = (form?: SchemesForm): SchemesForm =>
  new FormState([] as SchemeForm[]).validators(requireElement("Scheme"));

export type SchemeForm = FormState<{
  todo: StringField;
}>;

export const CreateSchemeForm = (form?: SchemeForm): SchemeForm =>
  new FormState({
    todo: new FieldState("")
  });
