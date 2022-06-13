import React from "react";
import {
  Datagrid,
  DateField,
  EmailField,
  List,
  NumberField,
  ReferenceField,
  TextField,
} from "react-admin";

export const UsersList = () => (
  <List>
    <Datagrid rowClick="edit">
      <ReferenceField source="id" reference="users">
        <TextField source="id" />
      </ReferenceField>
      <NumberField source="permissionLevel" />
      <EmailField source="email" />
    </Datagrid>
  </List>
);