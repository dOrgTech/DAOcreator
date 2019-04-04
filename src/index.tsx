import * as React from "react"
import * as ReactDOM from "react-dom"
import App from "./components/App"

import { MuiThemeProvider } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import { ConnectedRouter } from "connected-react-router"
import { Provider } from "react-redux"

import { configureStore } from "./redux/store"
import createHashHistory from "history/createHashHistory"

import theme from "./style/theme"

const history = createHashHistory()
const store = configureStore(history)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root") as HTMLElement
)
