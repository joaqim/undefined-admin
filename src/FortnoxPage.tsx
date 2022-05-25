import React from "react";
import { Admin, ListGuesser, Resource } from "react-admin";
import AuthenticateFortnoxPage from "./AuthenticateFortnoxPage";
import { fortnoxAuthProvider } from "./authProvider";
import { fortnoxDataProvider } from "./dataProvider";
import InvoiceList from "./invoices/InvoiceList";
import { Layout } from "./layout";

export const FortnoxPage = () => (
  <Admin
    authProvider={fortnoxAuthProvider}
    dataProvider={fortnoxDataProvider}
    loginPage={AuthenticateFortnoxPage}
    layout={Layout}
  >
    <Resource name="invoices" list={InvoiceList} />
    <Resource name="articles" list={ListGuesser} />
    <Resource name="orders" list={ListGuesser} />
    <Resource name="customers" list={ListGuesser} />
  </Admin>
);
