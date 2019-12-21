import * as React from "react";
import { DAOConfigForm, DAOForm } from "@dorgtech/daocreator-lib";
import { AccordionSection } from "react-rainbow-components";
// import { Box, Grid, FormLabel, FormControl, Input, Button } from "@chakra-ui/core";

// eslint-disable-next-line
interface Props {
  daoForm: DAOForm;
}

class InstallStep extends React.Component<Props> {
  render() {
    return (
      <>
        <AccordionSection
          name="3"
          label="4 Install Organization"
        ></AccordionSection>
      </>
    );
  }
}

export default InstallStep;
