import React, { useState, useEffect } from "react";
import { Admin, Layout, Resource } from "react-admin";
import { CoreLayoutProps, useLogin } from "ra-core";
import * as ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

import {
  query,
  initThinBackend,
  ensureIsUser,
  User,
  loginWithRedirect,
} from "thin-backend";
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
import { loadToken, saveToken, tryValidateToken } from "./src/tokenUtils";
import { ListGuesser } from "react-admin";
import CurrencyUtils from "./src/utils/CurrencyUtils";
import Token from "./src/Token";

const MyLayout = (props: CoreLayoutProps) => <Layout {...props} />;

const App = () => {
  const user = useCurrentUser();

  let isAuthenticated = false;
  let [currency, setCurrency] = useState(0);
  /*
  const token = useQuerySingleResult(query("fortnox_tokens").where("userId", user.id));
    */

  useEffect(() => {

    const fetchCurrency = async () => {
      const currency = await CurrencyUtils.fetchCurrencyRate(new Date(), "EUR");
      setCurrency(currency)
    }
    fetchCurrency()
    if (!user || isAuthenticated || localStorage.getItem("token")) return;
    const tryFetchAndValidateToken = async (user: User) => {
      let token = (await query("fortnox_tokens")
        .where("userId", user.id)
        .fetchOne()) as Token;

      if (token) {
        try {
          saveToken(token);
        } catch {
          fortnoxAuthProvider("AUTH_CHECK", { token });
          saveToken(token);
        }
      }

      isAuthenticated = true;
    };

    tryFetchAndValidateToken(user).catch((reason: any) => {
      console.log(reason);
      isAuthenticated = false;
    });
  }, [user, isAuthenticated]);

  return (
    <ThinBackend requireLogin>
      <div className="container">
        <AppNavbar />
      </div>
      <h3>{currency.toString()}</h3>
      <Admin
        authProvider={fortnoxAuthProvider}
        dataProvider={fortnoxDataProvider}
        loginPage={AuthenticateFortnoxPage}
        layout={MyLayout}
      >
        {/*   <Resource name="invoices" list={InvoiceList} />
        <Resource name="articles" list={ListGuesser} />
        <Resource name="orders" list={ListGuesser} />
        <Resource name="customers" list={ListGuesser} /> */}
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
