import React, { useState, FC, Fragment, useEffect } from "react";
import { MemberForm, MembersForm, getWeb3 } from "@dorgtech/daocreator-lib";
import { MDBBox, MDBContainer, MDBRow } from "mdbreact";

import { MemberEditor, MembersAnalytics, MembersTable } from "./";
import { useForceUpdate } from "../../../utils/hooks";
import Toggle from "../Schemes/Toggle";

const MembersEditor = ({ form }: { form: MembersForm }) => {
  /*
   * State
   */

  const { getDAOTokenSymbol } = form;
  const tokenSymbol = getDAOTokenSymbol();

  const [memberForm, setMemberForm] = useState(
    new MemberForm(getDAOTokenSymbol)
  );
  const [userMemberForm, setUserMemberForm] = useState<MemberForm>(
    new MemberForm(getDAOTokenSymbol)
  );
  const [editedMemberForm] = useState(new MemberForm(getDAOTokenSymbol));

  const [editing, setEditing] = useState(-1);
  const [web3Connected, setWeb3Connected] = useState(false);
  const [web3, setWeb3] = useState<any>(undefined);
  const [distribution, setDistribution] = useState(false);
  const [userAdded, setUserAdded] = useState(false);

  const newMemberForm = () => {
    const memberForm = new MemberForm(getDAOTokenSymbol);
    memberForm.$.reputation.value = "100";
    distribution
      ? (memberForm.$.tokens.value = "100")
      : (memberForm.$.tokens.value = "0");
    return memberForm;
  };

  /*
   * Hooks
   */

  const forceUpdate = useForceUpdate();

  // TODO check for web3 on load
  useEffect(() => {
    if (!web3Connected) {
      setUserMemberForm(new MemberForm(getDAOTokenSymbol));
      return;
    }
    try {
      userMemberForm.$.address.value = web3.eth.defaultAccount;
    } catch (e) {
      console.log(e);
      return;
    }
    userMemberForm.$.reputation.value = "100";
    distribution
      ? (userMemberForm.$.tokens.value = "100")
      : (userMemberForm.$.tokens.value = "0");
  }, [web3Connected, distribution, getDAOTokenSymbol]);

  useEffect(() => {
    memberForm.$.reputation.value = "100";
    distribution
      ? (memberForm.$.tokens.value = "100")
      : (memberForm.$.tokens.value = "0");
  }, [distribution]);

  /*
   * Buttons
   */

  const handleMetamask = async () => {
    try {
      const web3 = await getWeb3();
      setWeb3(web3);
      setWeb3Connected(true);
    } catch (e) {
      console.log(e);
    }
  };

  const addUser = async () => {
    const validate = await userMemberForm.validate();
    if (validate.hasError) return;
    form.$.push(userMemberForm);

    const membersValidate = await form.validate();
    if (membersValidate.hasError) form.$.pop();

    forceUpdate();

    setUserAdded(true);

    setUserMemberForm(newMemberForm());
  };

  const onSubmit = async (event: any) => {
    event.preventDefault();
    const validate = await memberForm.validate();

    if (validate.hasError) return;

    form.$.push(memberForm);
    const membersValidate = await form.validate();

    if (membersValidate.hasError) {
      form.$.pop();
      forceUpdate();
      return;
    }
    forceUpdate();

    setMemberForm(newMemberForm());
  };

  const selectEdit = (index: number) => {
    editedMemberForm.setValues(form.$[index].values);
    setEditing(index);
  };

  const onEdit = async (index: number) => {
    const backup = form.$[index].values;
    const memberValidate = await editedMemberForm.validate();

    if (memberValidate.hasError) {
      forceUpdate();
      return;
    }

    form.$[index].setValues(editedMemberForm.values);

    const membersValidate = await form.validate();

    if (membersValidate.hasError) {
      form.$[index].setValues(backup);
      forceUpdate();
      return;
    }
    setEditing(-1);
  };

  const onDelete = async (index: number) => {
    form.$.splice(index, 1);
    forceUpdate();
  };

  /*
   * Components
   */

  const MemberFormError: FC = () => (
    <Fragment>
      {form.showFormError && (
        <div style={{ marginRight: "-10px", color: "red" }}>
          <p>{form.error}</p>
        </div>
      )}
    </Fragment>
  );

  return (
    <MDBBox>
      <MDBContainer style={styles.noPadding}>
        <Toggle
          id={"distribution"}
          text={`Distribute ${tokenSymbol} token`}
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

        <MembersAnalytics
          data={form.toState()}
          getDAOTokenSymbol={getDAOTokenSymbol}
        />

        <div style={styles.thinDivider} />

        <MDBRow className="justify-content-start">
          <MemberEditor memberForm={memberForm} onSubmit={onSubmit} />
          {/* TODO check for account change */}
        </MDBRow>
        <MemberFormError />
        <MDBRow className="justify-content-center">
          {!web3Connected ? (
            <button
              style={styles.setDescriptionButton}
              onClick={handleMetamask}
            >
              Connect to Web3
            </button>
          ) : (
            !userAdded && (
              <button style={styles.setDescriptionButton} onClick={addUser}>
                Add Self
              </button>
            )
          )}
        </MDBRow>

        <div style={styles.thinDivider} />

        <MDBRow style={styles.tableWidth}>
          <MembersTable
            membersForm={form}
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
  },
  setDescriptionButton: {
    borderRadius: "0.37rem",
    fontWeight: 300,
    height: "39px",
    padding: "8px",
    fontFamily: "inherit",
    fontSize: "14px",
    width: "12rem",
    marginTop: "-20px",
    marginBottom: "5px"
  }
};

export default MembersEditor;
