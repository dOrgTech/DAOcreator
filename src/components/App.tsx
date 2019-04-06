import * as React from "react"
import { SFC } from "react"
import { Route, Switch } from "react-router"
import { SnackbarProvider } from "notistack"

import Background from "./shell/Background"
import Home from "./pages/Home"
import Overview from "./pages/Overview"
import DAOcreator from "./pages/DAOcreator"
import Notifications from "./common/Notifications"
import WaitingAnimation from "./common/WaitingAnimation"

const App: SFC = () => (
  <SnackbarProvider maxSnack={3}>
    <Background />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/dao-creator" component={DAOcreator} />
      <Route exact path="/overview" component={Overview} />
    </Switch>
    <WaitingAnimation />
    <Notifications />
  </SnackbarProvider>
)

export default App
