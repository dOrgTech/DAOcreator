import React, { useState } from "react";
import { Grid, Box, Button } from "@chakra-ui/core";
import { MemberForm, Member } from "@dorgtech/daocreator-lib";
import FormField from "components/commonV2/FormField";

import { useForceUpdate } from "utils/hooks/";

const MemberEditor = ({
  form,
  getDAOTokenSymbol
}: {
  form: any;
  getDAOTokenSymbol: any;
}) => {
  const forceUpdate = useForceUpdate();
  const [memberForm] = useState(new MemberForm(getDAOTokenSymbol));
  // const [membersForm] = useState(form);
  memberForm.$.reputation.value = "100";
  memberForm.$.tokens.value = "100";

  const onSubmit = async (event: any) => {
    event.preventDefault();
    const validate = await memberForm.validate();

    if (validate.hasError) return;

    form.$.push(new MemberForm(memberForm.getDAOTokenSymbol, memberForm));
    const membersValidate = await form.validate();

    if (membersValidate.hasError) {
      console.log("membersValidate", membersValidate);
      console.log("hasError");
      form.$.pop();
      forceUpdate();
      return;
    }
    forceUpdate();
    memberForm.$.address.reset();
  };

  return (
    <Box>
      <form onSubmit={onSubmit}>
        <Grid templateColumns="repeat(2, 1fr)" gap={2}>
          <Box w="80%">
            <FormField field={memberForm.$.address} editable={true}></FormField>
          </Box>
          <Box w="20%">
            <Button variantColor="blue" variant="solid" type="submit">
              Add Member
            </Button>
          </Box>
        </Grid>
      </form>
    </Box>
  );
};

export default MemberEditor;
