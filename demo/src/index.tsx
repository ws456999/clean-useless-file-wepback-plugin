import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.less";
import { A } from './this-is-only-import-type';

const a: A = {}

ReactDOM.render(
    <App />,
  document.getElementById("root")
);
