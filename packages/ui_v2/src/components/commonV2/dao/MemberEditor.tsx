import React from "react";
import { Grid, Box, Button } from "@chakra-ui/core";
import FormField from "components/commonV2/FormField";

export const MemberEditor = ({
  memberForm,
  onSubmit
}: {
  memberForm: any;
  onSubmit: any;
}) => {
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
