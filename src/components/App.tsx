import * as React from "react";
import { SFC } from "react";
import { Route, Switch } from "react-router";
import {
  withStyles,
  createStyles,
  Theme
} from "@material-ui/core";

import TopBar from "./shell/TopBar";
import Background from "./shell/Background";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Dapp from "./pages/Dapp";
import DAOcreator from "./pages/DAOcreator";

const App: SFC = () => (
  <div style={{
    display: 'inline-flex',
    minHeight: '100vh',
    flexDirection: 'column',
    width: '100vw',
    justifyContent: 'stretch'
  }}>
    <Background />
    <TopBar />
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route exact path="/about" component={About} />
      <Route exact path="/dapp" component={Dapp} />
      <Route exact path="/dao-creator" component={DAOcreator} />
    </Switch>

  </div>
);


export default App;