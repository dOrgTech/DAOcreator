import React, { useState, FC, Fragment, useEffect } from "react";
import { MemberForm, MembersForm, getWeb3 } from "@dorgtech/daocreator-lib";
import { MDBBox, MDBContainer, MDBRow, MDBBtn } from "mdbreact";

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
  const tokenSymbol = getDAOTokenSymbol;

  const [memberForm] = useState(new MemberForm(getDAOTokenSymbol));
  const [editedMemberForm] = useState(new MemberForm(getDAOTokenSymbol));
  const [editing, setEditing] = useState(-1);
  const [web3Connected, setWeb3Connected] = useState(false);

  const [userMemberForm, setUserMemberForm] = useState<MemberForm>(
    new MemberForm(form.getDAOTokenSymbol)
  );

  const [distribution, setDistribution] = useState(false);

  memberForm.$.reputation.value = "100";
  distribution
    ? (memberForm.$.tokens.value = "100")
    : (memberForm.$.tokens.value = "0");

  // TODO MOVE DOWN ONE LEVEL
  const [address, setAddress] = useState("");

  const handleMetamask = async () => {
    try {
      const web3 = await getWeb3();
      web3 && setAddress(web3.eth.defaultAccount);
      console.log(web3.eth.defaultAccount);
    } catch (e) {
      console.log(e);
    }
  };

  const addUser = () => {
    form.$.push(new MemberForm(form.getDAOTokenSymbol, userMemberForm));
  };

  // TODO check for web3 on load
  useEffect(() => {
    if (!web3Connected)
      setUserMemberForm(new MemberForm(form.getDAOTokenSymbol));

    userMemberForm.$.address.value = address;
    userMemberForm.$.reputation.value = "100";
    distribution
      ? (userMemberForm.$.tokens.value = "100")
      : (userMemberForm.$.tokens.value = "0");

    setUserMemberForm(userMemberForm);
  }, [web3Connected, distribution]);

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
      {/* TODO if user has already been added, remove button (TODO check for account change) */}
      {!web3Connected ? (
        <MDBBtn onClick={handleMetamask}>Connect to web3</MDBBtn>
      ) : (
        <MDBBtn onClick={addUser}>Add self</MDBBtn>
      )}
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
