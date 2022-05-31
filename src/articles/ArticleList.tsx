import React from "react";
import { BooleanField, Datagrid, DateField, List, TextField } from 'react-admin';

export const ArticleList = () => (
    <List>
        <Datagrid rowClick="edit">
            {/* <TextField source="@url" /> */}
            <TextField source="ArticleNumber" />
            <TextField source="Description" />
            {/* <TextField source="DisposableQuantity" /> */}
            {/* <DateField source="EAN" />
            <BooleanField source="Housework" /> */}
            {/* <TextField source="PurchasePrice" />
            <TextField source="SalesPrice" />
            <TextField source="QuantityInStock" />
            <TextField source="ReservedQuantity" />
            <TextField source="StockPlace" />
            <TextField source="StockValue" />
            <DateField source="Unit" />
            <TextField source="VAT" />
            <BooleanField source="WebshopArticle" /> */}
            {/* <TextField source="id" /> */}
        </Datagrid>
    </List>
);