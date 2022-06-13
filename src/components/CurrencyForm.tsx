import React, { ChangeEvent, FormEvent, useState } from "react";
import {
  Create,
  DateInput,
  NumberInput,
  SelectInput,
  SimpleForm,
  TextInput,
} from "react-admin";
const currencies = [
  { _id: 0, value: "SEK" },
  { _id: 1, value: "EUR" },
  { _id: 2, value: "USD" },
];

export const CurrencyForm = () => (
  <Create>
    <SimpleForm>
      <DateInput source="date" />
      <SelectInput
        source="currencyFrom"
        choices={currencies}
        optionText="value"
        optionValue="value"
      />
      <SelectInput
        source="currencyTo"
        choices={currencies}
        optionText="value"
        optionValue="value"
      />
    </SimpleForm>
  </Create>
);
