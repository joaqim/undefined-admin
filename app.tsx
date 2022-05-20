import React, { useState, useEffect } from "react";
import { Admin, Layout, Resource } from "react-admin";
import type { CoreLayoutProps } from "ra-core";
import * as ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

import { query, initThinBackend, ensureIsUser } from "thin-backend";
import {
  useQuery,
  useCurrentUser,
  ThinBackend,
  useQuerySingleResult,
} from "thin-backend/react";
import AppNavbar from "./src/AppNavbar";
import AuthenticateFortnoxPage from "./src/AuthenticateFortnoxPage";
import fortnoxAuthProvider from "./src/authProvider/fortnox";
import fortnoxDataProvider from "./src/dataProvider/fortnox";
import InvoiceList from "./src/invoices/InvoiceList";

const Tokens = () => {
  const token = useQuerySingleResult(query("fortnox_tokens"));

  return token ? <div>Access: {token?.accessToken}</div> : null;
};

const MyLayout = (props: CoreLayoutProps) => <Layout {...props} />;

const App = () => {
  const user = useCurrentUser();
  const token = useQuerySingleResult(query("fortnox_tokens"));

  return (
    <ThinBackend requireLogin>
      <div className="container">
        <AppNavbar />
        <Tokens />
        {token && <div>Fortnox Authenticated</div>}
      </div>
      <Admin
        authProvider={fortnoxAuthProvider}
        dataProvider={fortnoxDataProvider}
        loginPage={AuthenticateFortnoxPage}
        layout={MyLayout}
      >
        <Resource name="invoices" list={InvoiceList} />
      </Admin>
    </ThinBackend>
  );
};

// This needs to be run before any calls to `query`, `createRecord`, etc.
initThinBackend({ host: process.env.REACT_APP_BACKEND_URL });

// Start the React app
// ReactDOM.render(<App/>, document.getElementById('app'));
const container = document.getElementById("app");
const root = createRoot(container!);
root.render(<App />);
