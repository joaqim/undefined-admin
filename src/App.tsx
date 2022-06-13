import React from "react";
import { Admin, ListGuesser, Resource } from "react-admin";
import { Route } from "react-router-dom";
import authProvider from "./authProvider/authProvider";
import { CurrencyForm } from "./components/CurrencyForm";
import { CurrencyList } from "./components/CurrencyList";
import { UsersList } from "./components/UsersList";
import dataProvider from "./dataProvider/dataProvider";

import { Create, SimpleForm, TextInput, NumberInput } from "react-admin";



const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider}>
    <Resource name="users" list={UsersList} />
    <Resource name="currency" list={CurrencyList} create={CurrencyForm}/>
  </Admin>
);
export default App;
