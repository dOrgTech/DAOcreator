import * as React from "react";
import { SFC } from "react";
import { Route, Switch } from "react-router";

import TopBar from "./shell/TopBar";
import Background from "./shell/Background";
import Landing from "./pages/Landing";
import Overview from "./pages/Overview";
import About from "./pages/About";
import Dapp from "./pages/Dapp";
import DAOcreator from "./pages/DAOcreator";

const App: SFC = () => (
  <div
    style={{
      position: "absolute",
      width: "100%",
      height: "100%",
      minWidth: "455px"
    }}
  >
    <Background />
    <TopBar />
    <Switch>
      <Route exact path="/overview" component={Overview} />
      <Route exact path="/dapp" component={Dapp} />
      <Route exact path="/about" component={About} />
      <Route exact path="/dao-creator" component={DAOcreator} />
      <Route exact path="/" component={Landing} />
    </Switch>
  </div>
);

export default App;
