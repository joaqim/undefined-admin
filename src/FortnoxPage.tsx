import React from "react";
import { Admin, ListGuesser, Resource } from "react-admin";
import AuthenticateFortnoxPage from "./AuthenticateFortnoxPage";
import { fortnoxAuthProvider } from "./authProvider";
import { fortnoxDataProvider } from "./dataProvider";
import InvoiceList from "./invoices/InvoiceList";
import { Layout } from "./layout";

import InvoiceIcon from "@mui/icons-material/Book";
import ArticleIcon from "@mui/icons-material/Storefront"
import OrderIcon from "@mui/icons-material/Receipt"
import CustomerIcon from "@mui/icons-material/Group"

export const FortnoxPage = () => (
  <Admin
    authProvider={fortnoxAuthProvider}
    dataProvider={fortnoxDataProvider}
    loginPage={AuthenticateFortnoxPage}
    /* layout={Layout} */
  >
    <Resource name="invoices" list={InvoiceList} icon={InvoiceIcon} />
    <Resource name="articles" list={ListGuesser} icon={ArticleIcon} />
    <Resource name="orders" list={ListGuesser} icon={OrderIcon} />
    <Resource name="customers" list={ListGuesser} icon={CustomerIcon}/>
  </Admin>
);
