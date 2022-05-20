import React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  DateField,
} from "react-admin";

const InvoiceList = () => (
  <List>
    <Datagrid rowClick="edit">
      {/* <TextField source="@url" /> */}
      {/* <NumberField source="Balance" /> */}
      <TextField source="CustomerName" />
      <TextField source="CustomerNumber" />
      <NumberField source="Total" />
      <BooleanField source="Booked" />
      <BooleanField source="Cancelled" />
      {/* <DateField source="CostCenter" /> */}
      <TextField source="Currency" />
      <TextField source="CurrencyRate" />
      <NumberField source="CurrencyUnit" />

      <TextField source="DocumentNumber" />
      <DateField source="DueDate" />
      {/* <DateField source="ExternalInvoiceReference1" /> */}
      {/* <DateField source="ExternalInvoiceReference2" /> */}
      <DateField source="InvoiceDate" />
      <TextField source="InvoiceType" />
      {/* <BooleanField source="NoxFinans" /> */}
      {/* <TextField source="OCR" /> */}
      {/*  <TextField source="VoucherNumber" />
            <TextField source="VoucherSeries" />
            <TextField source="VoucherYear" />
            <DateField source="WayOfDelivery" />
            <DateField source="TermsOfPayment" />
            <DateField source="Project" /> */}
      <BooleanField source="Sent" />
      {/* <TextField source="FinalPayDate" /> */}
      {/* <TextField source="id" hidden={true} /> */}
    </Datagrid>
  </List>
);

export default InvoiceList;
