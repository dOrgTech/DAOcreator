import * as React from "react";
import { SFC } from "react";
import { Route, Switch } from "react-router";

import TopBar from "./shell/TopBar";
import Background from "./shell/Background";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Dapp from "./pages/Dapp";
import DAOcreator from "./pages/DAOcreator";

const App: SFC = () => (
  <div>
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
