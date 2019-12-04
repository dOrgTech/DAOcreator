import * as React from "react";
import { ThemeProvider } from "@chakra-ui/core";

import DAOcreatorV2 from "./DAOcreatorV2";
import theme from "./theme";

interface Props {
  theme?: any;
}

const Index: React.FC<Props> = () => {
  return (
    <ThemeProvider theme={theme}>
      <DAOcreatorV2 />
    </ThemeProvider>
  );
};

export default Index;
