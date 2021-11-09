import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import auth from './auth'
import currency from './currency'

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    auth,
    currency
  })

export default createRootReducer
