import * as React from "react"
import { SFC } from "react"
import { Route, Switch } from "react-router"

import Layout from "./components/Layout"
import Background from "./components/Background"
import Home from "./components/Home"
import SummaryView from "./components/DaoCreator/SummaryView"
import Founders from "./components/Founders"
import Notifications from "./components/Notifications"

const App: SFC = () => (
  <Layout>
    <Background />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/create-dao/summary" component={SummaryView} />
      <Route path="/create-dao/founders" component={Founders} />
    </Switch>
    <Notifications />
  </Layout>
)

export default App
