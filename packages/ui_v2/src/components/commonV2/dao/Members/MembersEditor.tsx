import React, { useState } from "react";
import { MemberForm } from "@dorgtech/daocreator-lib";
import { MDBBox, MDBTypography, MDBContainer, MDBRow } from "mdbreact";

import {
  MemberEditor,
  MembersAnalytics,
  MembersTable
} from "./";
import { useForceUpdate } from "../../../utils/hooks";

const MembersEditor = ({
  form,
  getDAOTokenSymbol,
  address,
  step
}: {
  form: any;
  getDAOTokenSymbol: any;
  address: string;
  step: number;
}) => {
  const forceUpdate = useForceUpdate();
  const [memberForm] = useState(new MemberForm(getDAOTokenSymbol));
  const [editedMemberForm] = useState(new MemberForm(getDAOTokenSymbol));
  const [editing, setEditing] = useState(-1);
  const [addressAdded, setAddressAdded] = useState(true);

  memberForm.$.reputation.value = "100";
  memberForm.$.tokens.value = "100";

  if (step === 2 && addressAdded) {
    const member = new MemberForm(form.getDAOTokenSymbol);
    member.$.address.value = address;
    member.$.reputation.value = "0";
    member.$.tokens.value = "0";
    form.$.push(new MemberForm(form.getDAOTokenSymbol, member));
    setAddressAdded(false);
  }
  const membersForm = form;

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
      <MDBContainer style={styles.noPadding}>
        <MembersAnalytics data={membersForm.toState()} />
        <MDBRow className="justify-content-start">
          <MemberEditor memberForm={memberForm} onSubmit={onSubmit} />
        </MDBRow>
        <MDBRow>
          <MemberFormError />
        </MDBRow>
        <br />
        <MDBRow style={styles.tableWidth}>
          <MembersTable
            membersForm={membersForm}
            editing={editing}
            editedMemberForm={editedMemberForm}
            onEdit={onEdit}
            onDelete={onDelete}
            selectEdit={selectEdit}
          />
        </MDBRow>
      </MDBContainer>
    </MDBBox>
  );
};

const styles = {
  tableWidth: {
    width: "-webkit-fill-available"
  },
  noPadding: {
    padding: "1px"
  }
};

export default MembersEditor;
