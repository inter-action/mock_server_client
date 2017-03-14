import * as React from "react";
import * as ReactDOM from "react-dom";

import {
  BrowserRouter as Router,
  Route,
  Link,
  HashRouter,
  Switch
  // etc.
} from "react-router-dom";

import { Home } from "./pages"

if (!document.querySelector("#app")) {
  const root = document.createElement("div");
  root.id = "app";
  document.body.appendChild(root);
}

let target = document.querySelector("#app");
if (!target.hasChildNodes()) {
  // http://stackoverflow.com/questions/42095600/nested-routes-in-v4
  ReactDOM.render(
    <Router>
      <Route path="/" component={Home}></Route>
    </Router>
    , document.querySelector("#app")
  );
}
