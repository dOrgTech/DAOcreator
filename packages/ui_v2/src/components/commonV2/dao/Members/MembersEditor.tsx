import React, { useState } from "react";
import { MemberForm } from "@dorgtech/daocreator-lib";
import { MDBBox, MDBTypography } from "mdbreact";

import { useForceUpdate } from "utils/hooks/";
import {
  MemberEditor,
  MembersAnalytics,
  MembersTable
} from "components/commonV2/dao/Members";

const MembersEditor = ({
  form,
  getDAOTokenSymbol,
  address
}: {
  form: any;
  getDAOTokenSymbol: any;
  address: string;
}) => {
  const forceUpdate = useForceUpdate();
  const [memberForm] = useState(new MemberForm(getDAOTokenSymbol));
  const [editedMemberForm] = useState(new MemberForm(getDAOTokenSymbol));
  const membersForm = form;

  // we add the current address of user
  const member = new MemberForm(getDAOTokenSymbol);
  member.$.address.value = address;
  member.$.reputation.value = "0";
  member.$.tokens.value = "0";
  membersForm.$.push(new MemberForm(member.getDAOTokenSymbol, member));
  const [editing, setEditing] = useState(-1);

  memberForm.$.reputation.value = "100";
  memberForm.$.tokens.value = "100";

  const onSubmit = async (event: any) => {
    event.preventDefault();
    const validate = await memberForm.validate();

    if (validate.hasError) return;

    membersForm.$.push(
      new MemberForm(memberForm.getDAOTokenSymbol, memberForm)
    );
    const membersValidate = await membersForm.validate();

    if (membersValidate.hasError) {
      membersForm.$.pop();
      forceUpdate();
      return;
    }
    forceUpdate();
    memberForm.$.address.reset();
  };

  const selectEdit = (index: number) => {
    editedMemberForm.setValues(membersForm.$[index].values);
    setEditing(index);
  };

  const onEdit = async (index: number) => {
    const backup = membersForm.$[index].getValues();
    const memberValidate = await editedMemberForm.validate();

    if (memberValidate.hasError) {
      forceUpdate();
      return;
    }

    membersForm.$[index].setValues(editedMemberForm.values);

    const membersValidate = await membersForm.validate();

    if (membersValidate.hasError) {
      membersForm.$[index].setValues(backup);
      forceUpdate();
      return;
    }
    setEditing(-1);
  };

  const onDelete = async (index: number) => {
    membersForm.$.splice(index, 1);
    forceUpdate();
  };

  const MemberFormError = () => (
    <MDBBox>
      {membersForm.showFormError && (
        <MDBTypography tag="p" colorText="red">
          {membersForm.error}
        </MDBTypography>
      )}
    </MDBBox>
  );

  return (
    <MDBBox>
      <MembersAnalytics data={membersForm.toState()} />
      <MemberEditor memberForm={memberForm} onSubmit={onSubmit} />
      <MemberFormError />
      <MembersTable
        membersForm={membersForm}
        editing={editing}
        editedMemberForm={editedMemberForm}
        onEdit={onEdit}
        onDelete={onDelete}
        selectEdit={selectEdit}
      />
    </MDBBox>
  );
};

export default MembersEditor;
