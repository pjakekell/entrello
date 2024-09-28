import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducers from './reducers'
import sagas from './sagas'

let store : any
const sagaMiddleware = createSagaMiddleware()

const middlewares = [
  sagaMiddleware,
]

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const initStore = () => {
  store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(...middlewares))
  )
  sagaMiddleware.run(sagas)
  return store
}

initStore()
export default store
