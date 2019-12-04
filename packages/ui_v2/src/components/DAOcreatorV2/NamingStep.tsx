import * as React from "react";
import { DAOConfigForm, DAOForm } from "@dorgtech/daocreator-lib";
import { AccordionSection } from "react-rainbow-components";
import {
  Box,
  Grid,
  FormLabel,
  FormControl,
  Input,
  Button
} from "@chakra-ui/core";

// eslint-disable-next-line
interface Props {
  form: DAOConfigForm | any;
  daoForm: DAOForm | any;
  toReviewStep: () => void;
}

class NamingStep extends React.Component<Props> {
  render() {
    return (
      <>
        <AccordionSection label={true ? "1 Set Description" : "1 Description"}>
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
                <Input
                  id="daoSymbol"
                  placeholder="DXDD"
                  size="sm"
                  width={267}
                />
              </FormControl>
            </Box>
          </Grid>
          <Grid
            templateColumns="repeat(1, 1fr)"
            gap={1}
            style={{ marginTop: "3em" }}
          >
            <Box w="100%" h="10">
              <Button variantColor="blue" variant="solid">
                Set Description
              </Button>
            </Box>
          </Grid>
        </AccordionSection>
      </>
    );
  }
}

export default NamingStep;
