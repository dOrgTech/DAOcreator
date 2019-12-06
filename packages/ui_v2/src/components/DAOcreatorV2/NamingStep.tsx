import * as React from "react";
import { DAOConfigForm, DAOForm } from "@dorgtech/daocreator-lib";
import { AccordionSection } from "react-rainbow-components";
import { Box, Grid, Button } from "@chakra-ui/core";
import DAOConfigEditor from "components/commonV2/dao/DAOConfigEditor";

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
          <DAOConfigEditor form={this.props.form} editable={true} />
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
