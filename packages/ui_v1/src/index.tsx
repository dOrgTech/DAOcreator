import * as React from "react";
import * as ReactDOM from "react-dom";

import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { DAOcreator } from "./components";
import theme from "./style/theme";

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <DAOcreator />
  </MuiThemeProvider>,
  document.getElementById("root") as HTMLElement
);
