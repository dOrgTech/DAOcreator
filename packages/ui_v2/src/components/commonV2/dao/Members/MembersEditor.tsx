import React, { useState, FC, Fragment, useEffect } from "react";
import { MemberForm, MembersForm } from "@dorgtech/daocreator-lib";
import { MDBBox, MDBContainer, MDBRow } from "mdbreact";

import { MemberEditor, MembersAnalytics, MembersTable } from "./";
import { useForceUpdate } from "../../../utils/hooks";
import Toggle from "../Schemes/Toggle";

const MembersEditor = ({
  form,
  getDAOTokenSymbol
}: // step
// distributionState
{
  form: MembersForm;
  getDAOTokenSymbol: () => string;
  // step: number;
  // distributionState: any;
}) => {
  const forceUpdate = useForceUpdate();
  const tokenSymbol = getDAOTokenSymbol();

  const [memberForm] = useState(new MemberForm(getDAOTokenSymbol));
  const [editedMemberForm] = useState(new MemberForm(getDAOTokenSymbol));
  const [editing, setEditing] = useState(-1);
  const [web3Connected, setWeb3Connected] = useState(false);

  const [distribution, setDistribution] = useState(false);

  memberForm.$.reputation.value = "100";
  distribution
    ? (memberForm.$.tokens.value = "100")
    : (memberForm.$.tokens.value = "0");

  useEffect(() => {
    if (!web3Connected) return;
    console.log("MEH");
  }, [web3Connected]);

  // removed step 2 check
  // if (userAddress) {
  //   const member = new MemberForm(form.getDAOTokenSymbol);
  //   member.$.address.value = address;
  //   member.$.reputation.value = "100";
  //   member.$.tokens.value = "0";
  //   form.$.push(new MemberForm(form.getDAOTokenSymbol, member));
  //   setAddressAdded(false);
  // }
  const membersForm = form;

  memberForm.$.reputation.value = "100";
  distribution
    ? (memberForm.$.tokens.value = "100")
    : (memberForm.$.tokens.value = "0");

  const MemberFormError: FC = () => (
    <Fragment>
      {membersForm.showFormError && (
        <div style={{ marginRight: "-10px", color: "red" }}>
          <p>{membersForm.error}</p>
        </div>
      )}
    </Fragment>
  );

  return (
    <MDBBox>
      <MDBContainer style={styles.noPadding}>
        <Toggle
          id={"distribution"}
          text={`Distribute ${getDAOTokenSymbol()} token`}
          tooltip={
            " Distribute your organization’s native token at launch (regardless of initial distribution, the organization will be able to create more tokens after launch through proposals)"
          }
          toggle={() => {
            setDistribution(!distribution);
          }}
          disabled={false}
          checked={distribution}
          style={styles.toggle}
        />
        <div style={styles.divider} />
        {/* <MembersAnalytics
          data={membersForm.toState()}
          getDAOTokenSymbol={getDAOTokenSymbol}
        /> */}
        <div style={styles.thinDivider} />
        <MDBRow className="justify-content-start">
          {/* <MemberEditor memberForm={memberForm} onSubmit={onSubmit} /> */}
        </MDBRow>
        <MemberFormError />
        <div style={styles.thinDivider} />
        <MDBRow style={styles.tableWidth}>
          {/* <MembersTable
            membersForm={membersForm}
            editing={editing}
            editedMemberForm={editedMemberForm}
            onEdit={onEdit}
            onDelete={onDelete}
            selectEdit={selectEdit}
            tokenDistribution={distribution}
            getDAOTokenSymbol={getDAOTokenSymbol}
          /> */}
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
