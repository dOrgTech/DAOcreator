import * as React from "react"
import { SFC } from "react"
import { Route, Switch } from "react-router"

import Layout from "./components/Layout"
import Home from "./components/Home"
import DaoCreator from "./components/DaoCreator"
import Notifications from "./components/common/Notifications"
import WaitingAnimation from "./components/common/WaitingAnimation"

// TEMP
import NamingStep from "./components/DaoCreator/NamingStep"
import FoundersStep from "./components/DaoCreator/FoundersStep"
import FeaturesStep from "./components/DaoCreator/FeaturesStep"
import VotingStep from "./components/DaoCreator/VotingStep"
import ReviewStep from "./components/DaoCreator/ReviewStep"

const App: SFC = () => (
  <Layout>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/dao-creator" component={DaoCreator} />
      <Route exact path="/dao-creator/naming" component={NamingStep} />
      <Route exact path="/dao-creator/founders" component={FoundersStep} />
      <Route exact path="/dao-creator/features" component={FeaturesStep} />
      <Route exact path="/dao-creator/voting" component={VotingStep} />
      <Route exact path="/dao-creator/review" component={ReviewStep} />
    </Switch>
    <WaitingAnimation />
    <Notifications />
  </Layout>
)

export default App
