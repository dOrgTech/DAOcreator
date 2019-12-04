import * as React from "react";
import { DAOConfigForm, DAOForm } from "@dorgtech/daocreator-lib";
import { Card, AccordionSection, Input } from "react-rainbow-components";
import { PseudoBox } from "@chakra-ui/core";

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
          <Card>
            <Input
              label="Organisation Name"
              placeholder="Dao..."
              type="text"
              className="rainbow-p-around_medium"
              style={styles.btnInputs}
            />
            <Input
              label="Symbol"
              placeholder="DXD"
              type="text"
              className="rainbow-p-around_medium"
              style={styles.btnInputs}
            />
            <PseudoBox
              as="button"
              color="grey.700"
              fontWeight="semibold"
              py={2}
              px={4}
              borderWidth="1px"
              borderColor="grey.100"
              rounded="md"
            >
              Set Description
            </PseudoBox>
          </Card>
        </AccordionSection>
      </>
    );
  }
}
// <AccordionItem>
//   <AccordionHeader>
//     <Box flex="1" textAlign="left" width={width}>
//       { true ? '1 Set Description' : '1 DAO Name'}
//     </Box>
//     <AccordionIcon />
//   </AccordionHeader>
//   <AccordionPanel pb={4}>
//     <Grid templateColumns="repeat(2, 1fr)" gap={2}>
//       <Box w="100%" h="10">
//         <FormControl isRequired>
//           <FormLabel htmlFor="daoName">DAO Name</FormLabel>
//           <Input id="daoName" placeholder="DAO Name" />
//         </FormControl>
//       </Box>
//       <Box w="100%" h="10">
//         <FormControl isRequired>
//           <FormLabel htmlFor="daoSymbol">Symbol</FormLabel>
//           <Input id="daoSymbol" placeholder="DXDD" />
//         </FormControl>
//       </Box>
//     </Grid>
//     <Grid templateColumns="repeat(1, 1fr)" gap={1} style={{ marginTop: "3em" }}>
//       <Box w="100%" h="10">
//         <Button variantColor="blue" variant="solid">Set Description</Button>
//       </Box>
//     </Grid>
//   </AccordionPanel>
// </AccordionItem>
// STYLE
const styles = {
  btnInputs: {
    width: 300
  }
};

export default NamingStep;
