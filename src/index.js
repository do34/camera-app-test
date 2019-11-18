import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import "./index.css";
import Start from "./Start";
import App from "./App";
import Result from "./Result";
import Test from "./Test";

ReactDOM.render(
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={Start} />
        <Route path="/App" component={App} /> 
        <Route path="/Result" component={Result} /> 
        <Route path="/Test" component={Test} /> 
      </Switch>
    </div>
  </Router>,
  document.getElementById("root")
);
