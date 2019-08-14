import * as React from "react";
import { SFC } from "react";
import { Route, Switch } from "react-router";
import { SnackbarProvider } from "notistack";

import Background from "./shell/Background";
import Home from "./pages/Home";
import Overview from "./pages/Overview";
import About from "./pages/About";
import Dapp from "./pages/Dapp";
import DAOcreator from "./pages/DAOcreator";

const App: SFC = () => (
  <SnackbarProvider maxSnack={3}>
    <Background />
    <Switch>
      <Route exact path="/overview" component={Overview} />
      <Route exact path="/dapp" component={Dapp} />
      <Route exact path="/about" component={About} />
      <Route exact path="/dao-creator" component={DAOcreator} />
      <Route exact path="/" component={Home} />
    </Switch>
  </SnackbarProvider>
);

export default App;
