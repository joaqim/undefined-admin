import React, { useState, useEffect } from "react";
import { Admin, CustomRoutes, Resource } from "react-admin";
import { CoreLayoutProps, useLogin } from "ra-core";
import * as ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { WcOrderList } from "./orders/WcOrderList";
import { Route } from 'react-router';

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
import AppNavbar from "./AppNavbar";
import AuthenticateFortnoxPage from "./AuthenticateFortnoxPage";
import fortnoxAuthProvider from "./authProvider/fortnox";
import fortnoxDataProvider from "./dataProvider/fortnox";
import InvoiceList from "./invoices/InvoiceList";
import { loadToken, saveToken, tryValidateToken } from "./TokenUtils";
import { ListGuesser } from "react-admin";
import CurrencyUtils from "./utils/CurrencyUtils";
import Token from "./Token";
import { wooCommerceAuthProvider } from "./authProvider";
import { wooCommerceDataProvider } from "./dataProvider";
import {
  saveCredentials,
  tryFetchWooCommerceCredentials,
} from "./utils/WooCommerce";
import { WooCredentials } from "./types";
import { Layout } from "./layout";
import { lightTheme } from "./layout/themes";
import { FortnoxPage } from "./FortnoxPage";

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
};

// This needs to be run before any calls to `query`, `createRecord`, etc.
initThinBackend({ host: process.env.REACT_APP_BACKEND_URL });

const App = () => {
  const user = useCurrentUser();

  let [isAuthenticated, setAuthenticated] = useState(false);
  let [isAuthenticatedWoo, setAuthenticatedWoo] = useState(false);
  let [currency, setCurrency] = useState(0);

  let [loading, setLoading] = useState(false);
  /*
  const token = useQuerySingleResult(query("fortnox_tokens").where("userId", user.id));
    */

  useEffect(() => {
    /*
    const fetchCurrency = async () => {
      setLoading(true);
      CurrencyUtils.fetchCurrencyRate(new Date(), "EUR").then(() => {
        setLoading(false);
        setCurrency(currency);
      });
    };
    fetchCurrency();
    */

    if (!user) return;

    if (!isAuthenticatedWoo) {
      setLoading(true);
      tryFetchWooCommerceCredentials(user).then(
        (credentials: WooCredentials) => {
          setLoading(false);
          setAuthenticatedWoo(true);
          saveCredentials(credentials);
          //login({ credentials });
        }
      );
    }

    if (isAuthenticated || localStorage.getItem("token")) return;

    setLoading(true);
    tryFetchAndValidateToken(user)
      .then(() => {
        setLoading(false);
        setAuthenticated(true);
      })
      .catch((reason: any) => {
        console.log(reason);
        setAuthenticated(false);
      });
  }, [user, isAuthenticated]);

  return (
    <ThinBackend requireLogin>
      <div className="container">
        <AppNavbar />
      </div>
      <h3>{currency.toString()}</h3>
      {/* <CustomRoutes>
        <Route path="/fortnox" element={<FortnoxPage />} />
      </CustomRoutes> */}
      {/* <FortnoxPage/> */}
      <Admin
        authProvider={wooCommerceAuthProvider}
        dataProvider={wooCommerceDataProvider}
        layout={Layout}
        disableTelemetry
        theme={lightTheme}
      >
        <Resource name="orders" list={WcOrderList} />
      </Admin>
    </ThinBackend>
  );
};

export default App
/*
// Start the React app
// ReactDOM.render(<App/>, document.getElementById('app'));
const container = document.getElementById("app");
const root = createRoot(container!);
root.render(<App />); */
