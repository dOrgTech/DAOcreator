import React from "react";
import { MemberForm } from "@dorgtech/daocreator-lib";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core";
import { ButtonIcon } from "react-rainbow-components";
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
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="center"></TableCell>
          <TableCell align="center">Member</TableCell>
          <TableCell align="center">Reputation</TableCell>
          <TableCell align="center">Tokens</TableCell>
          <TableCell align="center"></TableCell>
          <TableCell align="center"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {membersForm.$.map((memberForm: MemberForm, index: number) =>
          editing !== index ? (
            <TableRow key={index}>
              <TableCell align="center">
                {" "}
                <EthAddressAvatar address={memberForm.values.address} />
              </TableCell>
              <TableCell align="center">
                <a
                  href={`https://etherscan.io/address/${memberForm.values.address}`}
                >
                  {truncateString(memberForm.values.address, 6, 4)}
                </a>
              </TableCell>
              <TableCell align="center">
                {memberForm.values.reputation}
              </TableCell>
              <TableCell align="center">{memberForm.values.tokens}</TableCell>
              <TableCell align="center">
                <div
                  className="rainbow-p-right_large"
                  onClick={() => {
                    selectEdit(index);
                  }}
                >
                  <ButtonIcon
                    variant="border"
                    size="small"
                    icon={<FontAwesomeIcon icon={faPencilAlt} />}
                  />
                </div>
              </TableCell>
              <TableCell align="center">
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
              </TableCell>
            </TableRow>
          ) : (
            <TableRow key={index}>
              <TableCell align="center">
                {" "}
                <EthAddressAvatar address={memberForm.values.address} />
              </TableCell>
              <TableCell align="center">
                {truncateString(memberForm.values.address, 6, 4)}
              </TableCell>
              <TableCell align="center">
                <FormField
                  field={editedMemberForm.$.reputation}
                  editable={true}
                ></FormField>
              </TableCell>
              <TableCell align="center">
                <FormField
                  field={editedMemberForm.$.tokens}
                  editable={true}
                ></FormField>
              </TableCell>
              <TableCell align="center">
                <div
                  className="rainbow-p-right_large"
                  onClick={() => {
                    onEdit(index);
                  }}
                >
                  <ButtonIcon
                    variant="border"
                    size="small"
                    icon={<FontAwesomeIcon icon={faCheck} />}
                  />
                </div>
              </TableCell>
              <TableCell align="center">
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
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
};
