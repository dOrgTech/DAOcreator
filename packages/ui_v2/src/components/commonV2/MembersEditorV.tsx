import React, { useState } from "react";
import { AccordionSection, Table, Column } from "react-rainbow-components";
import { Grid, Box, Text, Progress, Input, Button } from "@chakra-ui/core";
import { MemberForm, MembersForm, Member } from "@dorgtech/daocreator-lib";
import FormField from "../commonV2/FormField";
import MembersSaveLoad from "./dao/MembersSaveLoad";
import { values } from "mobx";

const MembersEditor = ({ dummyData, form, getDAOTokenSymbol }: { dummyData: Member[], form: any, getDAOTokenSymbol: any }) => {

    const [, updateState] = useState()
    const [memberForm] = useState(new MemberForm(getDAOTokenSymbol))
    const [membersForm] = useState(form)

    memberForm.$.reputation.value = '100';
    memberForm.$.tokens.value = '100';

    const onSubmit = async (event: any) => {
        event.preventDefault();
        let error = undefined;
        const validate = await memberForm.validate()
        if (validate.hasError) {
            error = memberForm.formError
            return;
        }

        membersForm.$.push(new MemberForm(memberForm.getDAOTokenSymbol, memberForm))
        const membersValidate = await membersForm.validate();
        console.log(membersValidate)
        if (membersValidate.hasError) {
            error = membersForm.error;
            membersForm.$.pop();
            return;
        }
        updateState('')
        memberForm.reset();
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
            <Table data={membersForm.$.map((memberForm: MemberForm) => {
               return memberForm.values; 
            })} keyField="id">
                <Column header="Member" field="address" />
                <Column header="Reputation" field="reputation" />
                <Column header="Tokens" field="tokens" />
                <Column header="" field="options" />
            </Table>
        </Box>
    )
}

export default MembersEditor;