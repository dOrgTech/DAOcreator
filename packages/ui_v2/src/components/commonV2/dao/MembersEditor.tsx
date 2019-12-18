import React, { useState } from "react";
import { MemberForm, Member } from "@dorgtech/daocreator-lib";

import { ButtonIcon } from "react-rainbow-components";
import { Grid, Box, Button } from "@chakra-ui/core";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import {
  faPencilAlt,
  faMinus,
  faCheck
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useForceUpdate } from "utils/hooks/";
import { truncateString } from "utils";

import EthAddressAvatar from "components/commonV2/EthAddressAvatar";
import PieChart from "components/commonV2/PieChart";
import FormField from "components/commonV2/FormField";
import MemberEditor from "components/commonV2/dao/MemberEditor";

const MembersEditor = ({
  form,
  getDAOTokenSymbol
}: {
  dummyData: Member[];
  form: any;
  getDAOTokenSymbol: any;
}) => {
  const forceUpdate = useForceUpdate();
  const [memberForm] = useState(new MemberForm(getDAOTokenSymbol));
  const [editedMemberForm] = useState(new MemberForm(getDAOTokenSymbol));
  const membersForm = form;
  const [editing, setEditing] = useState(-1);

  memberForm.$.reputation.value = "100";
  memberForm.$.tokens.value = "100";

  // const onSubmit = async (event: any) => {
  //   event.preventDefault();
  //   const validate = await memberForm.validate();
  //
  //   if (validate.hasError) return;
  //
  //   membersForm.$.push(
  //     new MemberForm(memberForm.getDAOTokenSymbol, memberForm)
  //   );
  //   const membersValidate = await membersForm.validate();
  //
  //   if (membersValidate.hasError) {
  //     membersForm.$.pop();
  //     forceUpdate();
  //     return;
  //   }
  //   forceUpdate();
  //   memberForm.$.address.reset();
  // };

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

  return (
    <Box>
      <Box>
        Token Distribution
        <PieChart
          data={membersForm.toState()}
          config={{
            size: 240,
            dataKey: "tokens",
            nameKey: "address"
          }}
        />
      </Box>

      <Box>
        Reputation Distribution
        <PieChart
          data={membersForm.toState()}
          config={{
            size: 240,
            dataKey: "reputation",
            nameKey: "address"
          }}
        />
      </Box>
      <MemberEditor form={membersForm} getDAOTokenSymbol={getDAOTokenSymbol} />
      {/*<Box>
        <form onSubmit={onSubmit}>
          <Grid templateColumns="repeat(2, 1fr)" gap={2}>
            <Box w="80%">
              <FormField
                field={memberForm.$.address}
                editable={true}
              ></FormField>
            </Box>
            <Box w="20%">
              <Button variantColor="blue" variant="solid" type="submit">
                Add Member
              </Button>
            </Box>
          </Grid>
        </form>
      </Box>*/}

      <Box>
        {membersForm.showFormError && (
          <Typography color={"error"}>{membersForm.error}</Typography>
        )}
      </Box>

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
    </Box>
  );
};

export default MembersEditor;
