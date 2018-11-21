import * as React from "react"
import { SFC } from "react"
import { Route, Switch } from "react-router"

import Layout from "./components/Layout"
import Background from "./components/Background"
import Home from "./components/Home"
import DaoCreationWizard from "./components/DaoCreationWizard"
import Notifications from "./components/Notifications"

// TEMP
import SummaryView from "./components/DaoCreationWizard/SummaryView"
import FoundersView from "./components/DaoCreationWizard/FoundersView"

const App: SFC = () => (
  <Layout>
    <Background />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/create-dao" component={DaoCreationWizard} />
      <Route exact path="/create-dao/summary" component={SummaryView} />
      <Route exact path="/create-dao/founders" component={FoundersView} />
    </Switch>
    <Notifications />
  </Layout>
)

export default App
