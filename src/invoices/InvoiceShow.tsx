import * as React from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { ReferenceField, TextField, useRecordContext } from "react-admin";

// import Basket from '../orders/Basket';
import { Invoice } from "findus"

const InvoiceShow = () => {
  const record = useRecordContext<Invoice>();
  console.log({ record })
  if (!record) return null;
  return (
    <Card sx={{ width: 600, margin: "auto" }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom>
              Undefined Stories
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom align="right">
              Invoice {record.DocumentNumber}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} container alignContent="flex-end">
            <ReferenceField
              reference="customers"
              source="customer_id"
              link={false}
            >
              <CustomerField />
            </ReferenceField>
          </Grid>
        </Grid>
        <Box height={20}>&nbsp;</Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom align="center">
              Date{" "}
            </Typography>
            <Typography gutterBottom align="center">
              {record.InvoiceDate?.toString()}
            </Typography>
          </Grid>

          <Grid item xs={5}>
            <Typography variant="h6" gutterBottom align="center">
              Order
            </Typography>
            <ReferenceField
              reference="commands"
              source="command_id"
              link={false}
            >
              <TextField
                source="reference"
                align="center"
                component="p"
                gutterBottom
              />
            </ReferenceField>
          </Grid>
        </Grid>
        {/* <Box margin="10px 0">
          <ReferenceField reference="commands" source="command_id" link={false}>
            <Basket />
          </ReferenceField>
        </Box> */}
      </CardContent>
    </Card>
  );
};

interface Customer {
  Name: string;
  Address1: string;
  City: string;
  ZipCode: number;
}

const CustomerField = () => {
  const record = useRecordContext<Customer>();
  return record ? (
    <Typography>
      {record.Name}
      <br />
      {record.Address1}
      <br />
      {record.City}, {record.ZipCode}
    </Typography>
  ) : null;
};

export default InvoiceShow;
