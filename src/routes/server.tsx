import * as url from "url";
import * as path from "path";
import * as fs from "fs";

import * as React from "react";
import { Home } from "../pages";
import * as ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
// import * as koa from 'koa';

import {
  BrowserRouter as Router,
  Route,
  Link,
  HashRouter,
  Switch,
  Redirect
  // etc.
} from "react-router-dom";


const NoMatch = ({ location }) => (
  <div>
    <h3>No match for <code>{location.pathname}</code></h3>
  </div>
)


// wrapping/composing
const RouteWithServerData = ({ component: Component, serverData, ...rest }) => (
  <Route {...rest} render={props => {
    {/*console.log("props:", props)*/ }
    return <Component {...props} serverData={serverData} />
  }
  } />
)

/*
  <script type="text/javascript" src="manifest.25c865a041d19fa37816.js"></script>
  <script type="text/javascript" src="vendor.af81dd470b2d382c1a0b.js"></script>
  <script type="text/javascript" src="main.c2c89a385870da0b5e0f.js"></script>
  <script type="text/javascript" src="style.308d4d1238647b438dec.js"></script>
*/

function sortByExample(js) {
  let arr = ["manifest", "vendor", "main", "style"];
  js.forEach(e => {
    arr.forEach((a, i) => {
      if (e.indexOf(a) !== -1) {
        arr[i] = e;
      }
    })
  })

  return arr;
}

async function parseClientResources() {
  return new Promise((resolve, reject) => {
    fs.readdir(path.resolve(__dirname, "../../../client/dist"), (err, files) => {
      if (err) reject(err)
      else {
        let js: string[] = [];
        let styles: string[] = [];

        files.forEach(file => {
          if (/\.css$/.test(file)) {
            styles.push(file)
          } else if (/\.js$/.test(file)) {
            js.push(file)
          }
        });
        resolve({ js: sortByExample(js), styles })
      }
    })
  });
}

let clientFiles;
export default function (logger) {
  return async function (ctx: any, next) {

    if (!clientFiles) {
      clientFiles = await parseClientResources();
    }

    // pass data down
    let serverData = ctx.serverData;
    logger.debug("serverData: ", serverData)
    // This context object contains the results of the render
    const context: any = {}

    let targetUrl = ctx.url

    // logger.debug("ctx.url is", ctx.url)
    // let urlobj = url.parse(ctx.url);
    // logger.debug("urlobj, ", urlobj)
    // if (urlobj.pathname && /\.html$/i, urlobj.pathname) {
    //   urlobj.pathname = urlobj.pathname.replace(/\.html$/i, '');
    // }
    // let targetUrl = url.format(urlobj)
    // logger.debug("after format, ", targetUrl)

    const html = ReactDOMServer.renderToString(
      <StaticRouter location={targetUrl} context={context}>
        <Switch>
          <RouteWithServerData path="/index.html" exact component={Home} serverData={serverData} />
          <Redirect from="/old-match.html" to="/will-match.html" />
          <Route path="/will-match.html" component={Home} />
          <Route component={NoMatch} />
        </Switch>
      </StaticRouter>
    )

    // context.url will contain the URL to redirect to if a <Redirect> was used
    if (context.url) {
      ctx.redirect(context.url);
    } else {
      await ctx.render("react-view", { ...clientFiles, html })
    }
  }
}