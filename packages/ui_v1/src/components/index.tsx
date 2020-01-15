import * as React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import DAOcreator from "./DAOcreator";
import defaultTheme, { CustomTheme } from "./theme";
import { ProviderOrGetter } from "@dorgtech/daocreator-lib";

interface Props {
  theme?: CustomTheme;
  setWeb3Provider?: ProviderOrGetter;
}

const Index: React.FC<Props> = ({ theme, setWeb3Provider }) => {
  let useTheme = defaultTheme;

  if (theme) {
    useTheme = theme;
  }

  return (
    <MuiThemeProvider theme={createMuiTheme(useTheme)}>
      <CssBaseline />
      <DAOcreator setWeb3Provider={setWeb3Provider} />
    </MuiThemeProvider>
  );
};

export default Index;
