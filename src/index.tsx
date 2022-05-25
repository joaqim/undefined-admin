/** @jsxRuntime classic */
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "proxy-polyfill";
// IE11 needs "jsxRuntime classic" for this initial file which means that "React" needs to be in scope
// https://github.com/facebook/create-react-app/issues/9906

import * as React from "react";

import App from "./App";
import { createRoot } from "react-dom/client";

// ReactDOM.render(<App />, document.getElementById('root'));
createRoot(
  document.getElementById("app")!,
)
.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);