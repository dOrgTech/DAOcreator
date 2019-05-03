import { routerMiddleware } from "connected-react-router"
import { History } from "history"
import { applyMiddleware, compose, createStore, Store } from "redux"
import thunkMiddleware from "redux-thunk"
import reducer from "../../redux/reducers"

export function configureStore(history: History): Store<any> {
  // Redux DevTools
  const composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const store = createStore(
    reducer(history),
    composeEnhancers(
      applyMiddleware(routerMiddleware(history), thunkMiddleware)
    )
  )

  return store
}
