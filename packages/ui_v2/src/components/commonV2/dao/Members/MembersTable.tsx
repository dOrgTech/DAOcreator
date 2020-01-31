import React from "react";
import { MemberForm } from "@dorgtech/daocreator-lib";
import { MDBRow, MDBContainer, MDBTooltip, MDBBtn, MDBIcon } from "mdbreact";

import EthAddressAvatar from "../../EthAddressAvatar";
import FormField from "../../FormField";
import { truncateString } from "../../../utils";

export const MembersTable = ({
  membersForm,
  editing,
  editedMemberForm,
  onEdit,
  onDelete,
  selectEdit,
  tokenDistribution,
  getDAOTokenSymbol
}: {
  membersForm: any;
  editing: number;
  editedMemberForm: MemberForm;
  onEdit: any;
  onDelete: any;
  selectEdit: any;
  tokenDistribution: boolean;
  getDAOTokenSymbol: () => string;
}) => {
  const TableRows = (memberForm: MemberForm, index: number) => {
    return (
      <tr key={index} style={styles.borderCell}>
        <td style={styles.avatarCell}>
          <EthAddressAvatar address={memberForm.values.address} />
        </td>
        <td style={styles.borderCell}>
          <div style={{ marginTop: "5px", marginLeft: "-20px" }}>
            <MDBTooltip domElement>
              <div //There is probably a better MDBReact component for this
                onClick={() => {
                  navigator.clipboard.writeText(memberForm.values.address);
                }}
                style={
                  (styles.noPadding,
                  { cursor: "pointer", display: "inline-block", color: "blue" })
                }
              >
                {truncateString(memberForm.values.address, 6, 4)}
              </div>
              <div>Copy</div>
            </MDBTooltip>
            <MDBBtn
              onClick={() =>
                window.open(
                  `https://etherscan.io/address/${memberForm.values.address}`
                )
              }
              floating
              size="lg"
              color="transparent"
              style={styles.link}
            ></MDBBtn>
          </div>
        </td>
        <td style={styles.borderCell}>
          {editing !== index ? (
            <div style={{ marginTop: "5px" }}>
              {memberForm.values.reputation}
            </div>
          ) : (
            <div
              style={{ marginLeft: "-20px" }}
              onKeyDown={(event: any) => {
                if (event.key === "Enter") onEdit(index);
              }}
            >
              <FormField
                field={editedMemberForm.$.reputation}
                editable={true}
                colSize={12}
              />
            </div>
          )}
        </td>
        {tokenDistribution ? (
          <td style={styles.borderCell}>
            {editing !== index ? (
              <div style={{ marginTop: "5px" }}>{memberForm.values.tokens}</div>
            ) : (
              <div
                style={{ marginLeft: "-20px" }}
                onKeyDown={(event: any) => {
                  if (event.key === "Enter") onEdit(index);
                }}
              >
                <FormField
                  field={editedMemberForm.$.tokens}
                  editable={true}
                  colSize={12}
                />
              </div>
            )}
          </td>
        ) : (
          <td></td>
        )}
        <td style={styles.borderCell}>
          <div
            onClick={() => {
              editing !== index ? selectEdit(index) : onEdit(index);
            }}
            style={{ paddingTop: "5px" }}
          >
            <MDBIcon icon="pen" className="blue-text"></MDBIcon>
          </div>
        </td>
        <td style={styles.borderCell}>
          <div
            onClick={() => {
              onDelete(index);
            }}
            style={{ paddingTop: "5px" }}
          >
            <MDBIcon icon="minus" className="red-text"></MDBIcon>
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
                {tokenDistribution ? (
                  <th style={styles.titles}>{getDAOTokenSymbol()} TOKEN</th>
                ) : (
                  <th></th>
                )}
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
  addressCell: {
    borderBottom: "1px solid lightgray",
    marginLeft: "-5px"
  },
  avatarCell: {
    borderBottom: "1px solid lightgray",
    width: "20px"
  },
  noPadding: {
    padding: 0
  },
  titles: {
    fontSize: "12px",
    color: "gray"
  },
  link: {
    backgroundColor: "transparent !important",
    color: "lightgray",
    boxShadow: "none",
    fontSize: "normal",
    border: "none",
    outline: "none",
    padding: 0,
    margin: "2px",
    marginLeft: "14px"
  }
};
