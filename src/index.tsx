import * as React from "react";
import * as ReactDOM from "react-dom";

import { Provider } from "react-redux";

import {
  BrowserRouter as Router,
  Route,
  Link,
  HashRouter,
  Switch
  // etc.
} from "react-router-dom";

import { redux } from "./utils"
import { getRoutes } from "./routes/browser";

if (!document.querySelector("#app")) {
  const root = document.createElement("div");
  root.id = "app";
  document.body.appendChild(root);
}

init();

function init() {
  let target = document.querySelector("#app");
  if (target.hasChildNodes()) return;
  ReactDOM.render(
    getRoutes(),
    document.querySelector("#app")
  );
}