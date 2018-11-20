import * as React from "react"
import { SFC } from "react"
import { Route, Switch } from "react-router"

import Layout from "./components/Layout"
import Home from "./components/Home"
import CreateDao from "./components/DaoCreation/CreateDao"
import Founders from "./components/Founders"
import Notifications from "./components/Notifications"

const App: SFC = () => (
  <Layout>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/create-dao" component={CreateDao} />
      <Route exact path="/configure-founders" component={Founders} />
    </Switch>
    <Notifications />
  </Layout>
)

export default App
