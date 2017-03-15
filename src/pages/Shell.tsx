import * as React from "react";
import { connect } from "react-redux"
import {
  Link,
  Route,
} from "react-router-dom";

import { Notification } from "element-react";

import { pub } from "../utils";


pub.get().reg("/notification", function action(msg) {
  let title = msg.title = "提示";
  let message = msg.message

  if (!msg.type) {
    Notification({
      title, message,
    });
  } else if (msg.type === "success") {
    Notification({
      title,
      message,
      type: "success"
    });
  } else if (msg.type === "error") {
    Notification.error({
      title, message
    });
  }
})

function App({ children }) {
  return (
    <div id="root-wrap">
      {children}
    </div>
  )
}


// wrapping/composing
export const AppShell = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => {
    let children = <Component {...props} />
    return <App children={children} />
  }} />
)