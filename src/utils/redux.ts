import thunkMiddleware from "redux-thunk"
import * as createLogger from "redux-logger";

import { createStore, applyMiddleware } from "redux";
import rootReducer from "../flux/reducer";
const loggerMiddleware = createLogger();

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)

export function getStore() {
  if (!store) { throw new Error("invalid app state, store has to be initilized first") }
  return store;
}