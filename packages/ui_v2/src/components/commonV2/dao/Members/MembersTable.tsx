import React from "react";
import { MemberForm } from "@dorgtech/daocreator-lib";
import { ButtonIcon } from "react-rainbow-components";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faMinus,
  faCheck
} from "@fortawesome/free-solid-svg-icons";

import EthAddressAvatar from "components/commonV2/EthAddressAvatar";
import FormField from "components/commonV2/FormField";
import { truncateString } from "utils";

export const MembersTable = ({
  membersForm,
  editing,
  editedMemberForm,
  onEdit,
  onDelete,
  selectEdit
}: {
  membersForm: any;
  editing: number;
  editedMemberForm: MemberForm;
  onEdit: any;
  onDelete: any;
  selectEdit: any;
}) => {
  const TableRows = (memberForm: MemberForm, index: number) => {
    return (
      <tr key={index} className="test">
        <td>
          <EthAddressAvatar address={memberForm.values.address} />
        </td>
        <td>
          <a href={`https://etherscan.io/address/${memberForm.values.address}`}>
            {truncateString(memberForm.values.address, 6, 4)}
          </a>
        </td>
        <td>
          {editing !== index ? (
            memberForm.values.reputation
          ) : (
            <FormField
              field={editedMemberForm.$.reputation}
              editable={true}
            ></FormField>
          )}
        </td>
        <td>
          {editing !== index ? (
            memberForm.values.tokens
          ) : (
            <FormField
              field={editedMemberForm.$.tokens}
              editable={true}
            ></FormField>
          )}
        </td>
        <td>
          <div
            className="rainbow-p-right_large"
            onClick={() => {
              editing !== index ? selectEdit(index) : onEdit(index);
            }}
          >
            <ButtonIcon
              variant="border"
              size="small"
              icon={
                <FontAwesomeIcon
                  icon={editing !== index ? faPencilAlt : faCheck}
                />
              }
            />
          </div>
        </td>
        <td>
          <div
            className="rainbow-p-right_large"
            onClick={() => {
              onDelete(index);
            }}
          >
            <ButtonIcon
              variant="border"
              size="small"
              icon={<FontAwesomeIcon icon={faMinus} />}
            />
          </div>
        </td>
      </tr>
    );
  };
  return membersForm.$.length > 0 ? (
    <MDBTable>
      <MDBTableHead>
        <tr>
          <th></th>
          <th>Member</th>
          <th>Reputation</th>
          <th>Tokens</th>
          <th></th>
          <th></th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>{membersForm.$.map(TableRows)}</MDBTableBody>
    </MDBTable>
  ) : null;
};
