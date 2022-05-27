import React from "react";
import { DateInput } from "react-admin";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  DateField,
} from "react-admin";
import InvoiceShow from "./InvoiceShow";

const listFilters = [<DateInput source="InvoiceDate" alwaysOn />];

const InvoiceList = () => (
  <List
    filters={listFilters}
    perPage={5}
    sort={{ field: "date", order: "desc" }}
  >
    <Datagrid
      rowClick="expand"
      expand={<InvoiceShow />}
      sx={{
        "& .column-customer_id": {
          display: { xs: "none", md: "table-cell" },
        },
        "& .column-total_ex_taxes": {
          display: { xs: "none", md: "table-cell" },
        },
        "& .column-delivery_fees": {
          display: { xs: "none", md: "table-cell" },
        },
        "& .column-taxes": {
          display: { xs: "none", md: "table-cell" },
        },
      }}
    >
      {/* <TextField source="@url" /> */}
      {/* <NumberField source="Balance" /> */}
      <TextField source="DocumentNumber" />
      <TextField source="CustomerName" />
      {/* <TextField source="CustomerNumber" /> */}
      <NumberField source="Total" />
      <BooleanField source="Booked" />
      <BooleanField source="Cancelled" />
      {/* <DateField source="CostCenter" /> */}
      <TextField source="Currency" />
      <TextField source="CurrencyRate" />
      <NumberField source="CurrencyUnit" />

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
