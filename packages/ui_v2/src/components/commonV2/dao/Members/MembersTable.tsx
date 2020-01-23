import React from "react";
import { MemberForm } from "@dorgtech/daocreator-lib";
import { ButtonIcon } from "react-rainbow-components";
import { MDBRow, MDBContainer, MDBTooltip } from "mdbreact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faMinus,
  faCheck
} from "@fortawesome/free-solid-svg-icons";

import EthAddressAvatar from "../../EthAddressAvatar";
import FormField from "../../FormField";
import { truncateString } from "../../../utils";

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
      <tr key={index} className="test" style={styles.borderCell}>
        <td style={styles.borderCell}>
          <EthAddressAvatar address={memberForm.values.address} />
        </td>
        <td style={styles.borderCell}>
          <MDBTooltip domElement>
            <a // TODO There is probably a better MDBReact component for this
              onClick={() => {
                navigator.clipboard.writeText(memberForm.values.address);
              }}
              // href={`https://etherscan.io/address/${memberForm.values.address}`}
              href="#!"
              style={styles.noPadding}
            >
              {truncateString(memberForm.values.address, 6, 4)}
            </a>
            <div>Copy</div>
          </MDBTooltip>
        </td>
        <td style={styles.borderCell}>
          {editing !== index ? (
            memberForm.values.reputation
          ) : (
            <FormField
              field={editedMemberForm.$.reputation}
              editable={true}
            ></FormField>
          )}
        </td>
        <td style={styles.borderCell}>
          {editing !== index ? (
            memberForm.values.tokens
          ) : (
            <FormField
              field={editedMemberForm.$.tokens}
              editable={true}
            ></FormField>
          )}
        </td>
        <td style={styles.borderCell}>
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
        <td style={styles.borderCell}>
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
    <MDBContainer>
      <MDBRow style={styles.tableWidth}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={styles.titles}> MEMBERS</th>
                <th></th>
                <th style={styles.titles}>REPUTATION</th>
                <th style={styles.titles}>TOKENS</th>
                <th></th>
                <th></th>
              </tr>
            </thead>

            <tbody>{membersForm.$.map(TableRows)}</tbody>
          </table>
        </div>
      </MDBRow>
    </MDBContainer>
  ) : null;
};

const styles = {
  tableWidth: {
    width: "-webkit-fill-available",
    marginLeft: "-10.5px",
    marginRight: "-11.5px"
  },
  borderCell: {
    borderBottom: "1px solid lightgray"
  },
  borderTitleLeft: {
    borderLeft: "1px solid lightgray"
  },
  borderTitleRight: {
    borderRight: "1px solid lightgray"
  },
  noPadding: {
    padding: 0
  },
  titles: {
    fontSize: "12px",
    color: "gray"
  }
};
