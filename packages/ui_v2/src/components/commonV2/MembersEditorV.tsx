import React, { useState } from "react";
import { Column, ButtonIcon } from "react-rainbow-components";
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
import MaterialTable from 'material-table';

const MembersEditor = ({ form, getDAOTokenSymbol }: { dummyData: Member[], form: any, getDAOTokenSymbol: any }) => {

    const [, updateState] = useState()
    const [memberForm] = useState(new MemberForm(getDAOTokenSymbol))
    const [editedMemberForm] = useState(new MemberForm(getDAOTokenSymbol))
    const [membersForm] = useState(form)
    const [editing, setEditing] = useState(-1)

    memberForm.$.reputation.value = '100';
    memberForm.$.tokens.value = '100';

    console.log(editedMemberForm)

    const onSubmit = async (event: any) => {
        event.preventDefault();
        let error = undefined;
        const validate = await memberForm.validate()
        if (validate.hasError) {
            console.log(memberForm)
            error = memberForm.formError
            return;
        }

        membersForm.$.push(new MemberForm(memberForm.getDAOTokenSymbol, memberForm))
        const membersValidate = await membersForm.validate();
        console.log(membersValidate)
        if (membersValidate.hasError) {
            console.log(membersForm)
            error = membersForm.error;
            membersForm.$.pop();
            return;
        }
        updateState(memberForm.$.address.value)
        memberForm.$.address.reset();
    }

    const selectEdit = (index: number) =>{
        editedMemberForm.setValues(membersForm.$[index].values)
        console.log(editedMemberForm.$)
        setEditing(index);
    }

    const onEdit = async (index: number) => {
        let editError = undefined;
        const backup = membersForm.$[index].getValues();

        // Check the edited member for errors
        const memberValidate = await editedMemberForm.validate();
        if (memberValidate.hasError) {
            editError = editedMemberForm.error;
            return;
        }

        // See if the edited member can be reinserted into the array
        // without any errors
        membersForm.$[index].setValues(editedMemberForm.values);

        const membersValidate = await membersForm.validate();
        if (membersValidate.hasError) {
            editError = membersForm.error;
            membersForm.$[index].setValues(backup);
            return;
        }
        setEditing(-1)
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
                                <div className="rainbow-p-right_large">
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
                                    <div className="rainbow-p-right_large">
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