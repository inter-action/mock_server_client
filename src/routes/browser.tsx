import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  Route,
  Switch,
  HashRouter,
  // etc.
} from "react-router-dom";
import { Provider } from "react-redux";


import { redux } from "../utils"
import { AppList, AppShell } from "../pages"



// http://stackoverflow.com/questions/42095600/nested-routes-in-v4
export function getRoutes() {
  return (
    <Provider store={redux.getStore()}>
      <HashRouter>
        <Switch>
          <AppShell exact strict path="/" component={AppList} />
        </Switch>
      </HashRouter>
    </Provider>
  )
}
