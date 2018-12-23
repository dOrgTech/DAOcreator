import * as React from "react"
import { SFC } from "react"
import { Route, Switch } from "react-router"

import Layout from "./components/Layout"
import Home from "./components/Home"
import DaoCreator from "./components/DaoCreator"
import Notifications from "./components/Notifications"
import WaitingAnimation from "./components/WaitingAnimation"

// TEMP
import NamingStep from "./components/DaoCreator/NamingStep"
import FoundersStep from "./components/DaoCreator/FoundersStep"

const App: SFC = () => (
  <Layout>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/dao-creator" component={DaoCreator} />
      <Route exact path="/dao-creator/naming" component={NamingStep} />
      <Route exact path="/dao-creator/founders" component={FoundersStep} />
    </Switch>
    <WaitingAnimation />
    <Notifications />
  </Layout>
)

export default App
