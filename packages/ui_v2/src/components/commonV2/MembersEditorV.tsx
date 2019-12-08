import React, { useState } from "react";
import { ButtonIcon } from "react-rainbow-components";
import { Grid, Box, Button } from "@chakra-ui/core";
import { MemberForm, Member } from "@dorgtech/daocreator-lib";
import FormField from "../commonV2/FormField";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { faPencilAlt, faMinus, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from "@material-ui/core";

const MembersEditor = ({ form, getDAOTokenSymbol }: { dummyData: Member[], form: any, getDAOTokenSymbol: any }) => {

    const [, updateState] = useState()
    const [memberForm] = useState(new MemberForm(getDAOTokenSymbol))
    const [editedMemberForm] = useState(new MemberForm(getDAOTokenSymbol))
    const [membersForm] = useState(form)
    const [editing, setEditing] = useState(-1)

    memberForm.$.reputation.value = '100';
    memberForm.$.tokens.value = '100';

    const onSubmit = async (event: any) => {
        event.preventDefault();
        const validate = await memberForm.validate()

        if (validate.hasError) {
            updateState(Math.random())
            return;
        }

        membersForm.$.push(new MemberForm(memberForm.getDAOTokenSymbol, memberForm))
        const membersValidate = await membersForm.validate();

        if (membersValidate.hasError) {
            membersForm.$.pop();
            updateState(Math.random())
            return;
        }
        updateState(Math.random())
        memberForm.$.address.reset();
    }

    const selectEdit = (index: number) => {
        editedMemberForm.setValues(membersForm.$[index].values)
        setEditing(index);
    }

    const onEdit = async (index: number) => {
        const backup = membersForm.$[index].getValues();
        const memberValidate = await editedMemberForm.validate();

        if (memberValidate.hasError) {
            updateState(Math.random())
            return;
        }

        membersForm.$[index].setValues(editedMemberForm.values);

        const membersValidate = await membersForm.validate();

        if (membersValidate.hasError) {
            membersForm.$[index].setValues(backup);
            updateState(Math.random())
            return;
        }
        setEditing(-1)
    }

    const onDelete = async (index: number) => {
        membersForm.$.splice(index, 1);
        updateState(Math.random())
    }

    return (
        <Box>
            <Box>
                <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                    <form onSubmit={onSubmit}>
                        Field
                        <FormField field={memberForm.$.address} editable={true}></FormField>
                        <Button
                            variantColor="blue"
                            variant="solid"
                            type="submit">
                            Add Member
                        </Button>
                    </form>
                </Grid>
            </Box>
            <Box>
                {(membersForm.showFormError && (
                    <Typography color={"error"}>{membersForm.error}</Typography>
                ))}
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Member</TableCell>
                        <TableCell align="center">Reputation</TableCell>
                        <TableCell align="center">Tokens</TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {membersForm.$.map((memberForm: MemberForm, index: number) => editing !== index ? (
                        <TableRow key={index}>
                            <TableCell align="center">{memberForm.values.address}</TableCell>
                            <TableCell align="center">{memberForm.values.reputation}</TableCell>
                            <TableCell align="center">{memberForm.values.tokens}</TableCell>
                            <TableCell align="center">
                                <div className="rainbow-p-right_large" onClick={() => { selectEdit(index) }}>
                                    <ButtonIcon variant="border" size="small" icon={<FontAwesomeIcon icon={faPencilAlt} />} />
                                </div>
                            </TableCell>
                            <TableCell align="center">
                                <div className="rainbow-p-right_large" onClick={() => { onDelete(index) }}>
                                    <ButtonIcon variant="border" size="small" icon={<FontAwesomeIcon icon={faMinus} />} />
                                </div>
                            </TableCell>
                        </TableRow>
                    )
                        : (
                            <TableRow key={index}>
                                <TableCell align="center">{memberForm.values.address}</TableCell>
                                <TableCell align="center">
                                    <FormField field={editedMemberForm.$.reputation} editable={true}></FormField>
                                </TableCell>
                                <TableCell align="center">
                                    <FormField field={editedMemberForm.$.tokens} editable={true}></FormField>
                                </TableCell>
                                <TableCell align="center">
                                    <div className="rainbow-p-right_large" onClick={() => { onEdit(index) }}>
                                        <ButtonIcon variant="border" size="small" icon={<FontAwesomeIcon icon={faCheck} />} />
                                    </div>
                                </TableCell>
                                <TableCell align="center">
                                    <div className="rainbow-p-right_large" onClick={() => { onDelete(index) }}>
                                        <ButtonIcon variant="border" size="small" icon={<FontAwesomeIcon icon={faMinus} />} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </Box>
    )
}

export default MembersEditor;