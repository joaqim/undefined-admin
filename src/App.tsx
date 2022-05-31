import React, { useState, useEffect } from "react";

import { query, initThinBackend, User, FortnoxToken } from "thin-backend";
import { useCurrentUser, ThinBackend } from "thin-backend/react";
import AppNavbar from "./AppNavbar";
import fortnoxAuthProvider from "./authProvider/fortnox";
import { trySaveToken, sendOrUpdateToken, loadToken } from "./utils/TokenUtils";
import CurrencyUtils from "./utils/CurrencyUtils";
import Token from "./Token";
import {
  saveWooCredentials,
  tryFetchWooCredentials,
} from "./utils/WooCommerce";
import { WooCredentials } from "./types";
import { FortnoxPage } from "./FortnoxPage";
import { WooCommercePage } from "./WooCommercePage";

const tryFetchAndValidateToken = async (user: User): Promise<Token> => {
  return query("fortnox_tokens")
    .where("userId", user.id)
    .fetchOne()
    .then((token: FortnoxToken) => token as Token);
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
    const fetchCurrency = async () => {
      setLoading(true);
      CurrencyUtils.fetchCurrencyRate(new Date(), "EUR").then(
        (currencyRate) => {
          setLoading(false);
          setCurrency(currencyRate);
        }
      );
    };

    if (!user) return;

    window.addEventListener("new_fortnox_token", function (event) {
      let token = loadToken();
      if(token) {
        sendOrUpdateToken(token, user.id);
      }
    });

    /*
    if (!isAuthenticatedWoo) {
      setLoading(true);
      tryFetchWooCredentials(user).then(
        (credentials: WooCredentials) => {
          setLoading(false);
          setAuthenticatedWoo(true);
          saveWooCredentials(credentials);
        }
      );
    }
    */

    if (isAuthenticated || localStorage.getItem("token")) return;

    setLoading(true);
    tryFetchAndValidateToken(user)
      .then((token) => {
        if(token) {
          setLoading(false);
          setAuthenticated(true);
          // sendOrUpdateToken(token);
          trySaveToken(token);
        }
      })
      .catch((reason: any) => {
        console.log(reason);
        setAuthenticated(false);
      });
  }, [user, isAuthenticated]);

  return (
    <ThinBackend requireLogin>
      <AppNavbar />
      {/* <CustomRoutes>
        <Route path="/fortnox" element={<FortnoxPage />} />
      </CustomRoutes> */}
      <FortnoxPage />
      {/* <WooCommercePage /> */}
      {/* <Admin
        authProvider={wooCommerceAuthProvider}
        dataProvider={wooCommerceDataProvider}
        layout={Layout}
        disableTelemetry
        theme={lightTheme}
      >
        <Resource name="orders" list={WcOrderList} />
      </Admin> */}
    </ThinBackend>
  );
};

export default App;
/*
// Start the React app
// ReactDOM.render(<App/>, document.getElementById('app'));
const container = document.getElementById("app");
const root = createRoot(container!);
root.render(<App />); */
