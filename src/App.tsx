import * as React from "react";
import { SFC } from "react";
import { Route, Switch } from "react-router";

import Layout from "./components/Layout";
//TODO: import Startup from "./components/Startup";
import Home from "./components/Home";
import Notifications from "./components/Notifications";

const App: SFC = () => (
  <Layout>
    
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    
    <Notifications />
  </Layout>
);

export default App;
