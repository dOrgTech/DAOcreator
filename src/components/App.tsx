import * as React from "react"
import { SFC } from "react"
import { Route, Switch } from "react-router"

import Background from "./shell/Background"
import Home from "./pages/Home"
import DAOcreator from "./pages/DAOcreator"
import Notifications from "./common/Notifications"
import WaitingAnimation from "./common/WaitingAnimation"

// TODO: have these within the DAOCreator
import NamingStep from "./pages/DAOcreator/NamingStep"
import FoundersStep from "./pages/DAOcreator/FoundersStep"
import FeaturesStep from "./pages/DAOcreator/FeaturesStep"
import VotingStep from "./pages/DAOcreator/VotingStep"
import ReviewStep from "./pages/DAOcreator/ReviewStep"

const App: SFC = () => (
  <>
    <Background />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/dao-creator" component={DAOcreator} />
      <Route exact path="/dao-creator/naming" component={NamingStep} />
      <Route exact path="/dao-creator/founders" component={FoundersStep} />
      <Route exact path="/dao-creator/features" component={FeaturesStep} />
      <Route exact path="/dao-creator/voting" component={VotingStep} />
      <Route exact path="/dao-creator/review" component={ReviewStep} />
    </Switch>
    <WaitingAnimation />
    <Notifications />
  </>
)

export default App
