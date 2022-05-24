import React from "react";
import { Datagrid, DateField, List, TextField } from "react-admin";

export const CustomerList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="@url" />
      <TextField source="Address1" />
      <TextField source="Address2" />
      <TextField source="City" />
      <TextField source="CustomerNumber" />
      <TextField source="Email" />
      <TextField source="Name" />
      <DateField source="OrganisationNumber" />
      <DateField source="Phone" />
      <DateField source="ZipCode" />
      <TextField source="id" />
    </Datagrid>
  </List>
);
