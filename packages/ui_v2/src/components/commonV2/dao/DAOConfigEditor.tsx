import * as React from "react";
import { DAOConfigForm } from "@dorgtech/daocreator-lib";
import { Grid, Box, FormControl, FormLabel, Input } from "@chakra-ui/core";

interface Props {
  form: DAOConfigForm;
  editable: boolean;
}

export default class DAOConfigEditor extends React.Component<Props> {
  render() {
    // const { form, editable } = this.props;
    return (
      <>
        <Grid templateColumns="repeat(2, 1fr)" gap={2}>
          <Box w="100%" h="10">
            <FormControl isRequired>
              <FormLabel htmlFor="daoName" color="#9EA0A5" fontWeight={300}>
                Organisation Name
              </FormLabel>
              <Input
                id="daoName"
                placeholder="DAO Name"
                size="sm"
                width={267}
              />
            </FormControl>
          </Box>
          <Box w="100%" h="10">
            <FormControl isRequired>
              <FormLabel htmlFor="daoSymbol" color="#9EA0A5" fontWeight={300}>
                Symbol
              </FormLabel>
              <Input id="daoSymbol" placeholder="DXDD" size="sm" width={267} />
            </FormControl>
          </Box>
        </Grid>
      </>
    );
  }
}
