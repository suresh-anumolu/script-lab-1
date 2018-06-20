import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import throttle from 'lodash/throttle'

import selection from './selection'
import solutions from './solutions'
import files from './files'
import users from './users'
import ui from './ui'

import createSagas from '../sagas'

import { loadState, saveState } from '../localStorage'

const sagaMiddleware = createSagaMiddleware()
const reducer = combineReducers({ selection, solutions, files, users, ui })

const persistedData = loadState()
const store = createStore(reducer, persistedData, applyMiddleware(sagaMiddleware))

store.subscribe(
  throttle(() => {
    console.log('store updated!')
    console.log(store.getState())

    saveState(store.getState())
  }, 1000),
)

sagaMiddleware.run(createSagas)

export default store
