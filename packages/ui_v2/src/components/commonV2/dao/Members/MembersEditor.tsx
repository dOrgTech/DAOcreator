import React, { useState } from "react";
import { MemberForm } from "@dorgtech/daocreator-lib";
import { MDBBox, MDBTypography, MDBContainer, MDBRow } from "mdbreact";

import { MemberEditor, MembersAnalytics, MembersTable } from "./";
import { useForceUpdate } from "../../../utils/hooks";
import Toggle from "../Schemes/Toggle";

const MembersEditor = ({
  form,
  getDAOTokenSymbol,
  address,
  step,
  distributionState
}: {
  form: any;
  getDAOTokenSymbol: any;
  address: string;
  step: number;
  distributionState: any;
}) => {
  const forceUpdate = useForceUpdate();
  const [memberForm] = useState(new MemberForm(getDAOTokenSymbol));
  const [editedMemberForm] = useState(new MemberForm(getDAOTokenSymbol));
  const [editing, setEditing] = useState(-1);
  const [addressAdded, setAddressAdded] = useState(true);

  const { distribution, setDistribution } = distributionState;

  memberForm.$.reputation.value = "100";
  distribution
    ? (memberForm.$.tokens.value = "100")
    : (memberForm.$.tokens.value = "0");

  if (step === 2 && addressAdded) {
    const member = new MemberForm(form.getDAOTokenSymbol);
    member.$.address.value = address;
    member.$.reputation.value = "100";
    member.$.tokens.value = "0";
    form.$.push(new MemberForm(form.getDAOTokenSymbol, member));
    setAddressAdded(false);
  }
  const membersForm = form;

  memberForm.$.reputation.value = "100";
  distribution
    ? (memberForm.$.tokens.value = "100")
    : (memberForm.$.tokens.value = "0");

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

  const MemberFormError = () =>
    membersForm.showFormError ? (
      <div style={{ marginRight: "-10px", color: "red" }}>
        <p>{membersForm.error}</p>
      </div>
    ) : (
      <></>
    );

  return (
    <MDBBox>
      <MDBContainer style={styles.noPadding}>
        <Toggle
          id={"distribution"}
          text={`Distribute ${getDAOTokenSymbol()} token`}
          example={"Some example"}
          toggle={() => {
            setDistribution(!distribution);
          }}
          disabled={false}
          checked={distribution}
          style={styles.toggle}
        />
        <div style={styles.divider} />
        <MembersAnalytics
          data={membersForm.toState()}
          getDAOTokenSymbol={getDAOTokenSymbol}
        />
        <div style={styles.thinDivider} />
        <MDBRow className="justify-content-start">
          <MemberEditor memberForm={memberForm} onSubmit={onSubmit} />
        </MDBRow>
        <MemberFormError />
        <div style={styles.thinDivider} />
        <MDBRow style={styles.tableWidth}>
          <MembersTable
            membersForm={membersForm}
            editing={editing}
            editedMemberForm={editedMemberForm}
            onEdit={onEdit}
            onDelete={onDelete}
            selectEdit={selectEdit}
            tokenDistribution={distribution}
            getDAOTokenSymbol={getDAOTokenSymbol}
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
  },
  toggle: {
    paddingLeft: 15.35
  },
  divider: {
    flexGrow: 1,
    marginLeft: "-10px",
    border: "1px solid rgb(211, 211, 211)",
    width: "103.3%"
  },
  thinDivider: {
    flexGrow: 1,
    marginLeft: "-10px",
    border: "0.5px solid rgb(211, 211, 211)",
    width: "103.3%"
  }
};

export default MembersEditor;
