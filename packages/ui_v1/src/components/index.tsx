import * as React from "react";
import { MuiThemeProvider, Theme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import DAOcreator from "./DAOcreator";
import defaultTheme from "./theme";

interface Props {
  theme?: Theme;
}

const Index: React.FC<Props> = ({ theme }) => {
  let useTheme = defaultTheme;

  if (theme) {
    useTheme = theme;
  }

  return (
    <MuiThemeProvider theme={useTheme}>
      <CssBaseline />
      <DAOcreator />
    </MuiThemeProvider>
  );
};

export default Index;
