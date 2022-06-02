import React from 'react';
import { ArrayField, BooleanField, ChipField, Datagrid, DateField, List, ReferenceField, SingleFieldList, TextField } from 'react-admin';
import WcOrderShow from './WcOrderShow';

const WcOrderList = () => (
    <List>
        <Datagrid /* rowClick="edit" */
        rowClick="expand"
        expand={<WcOrderShow/>}
        sort={{ field: "date", order: "desc" }}
        >
            <TextField source="id" />
            <TextField source="billing.first_name" />
            {/* <ReferenceField source="parent_id" reference="parents"><TextField source="id" /></ReferenceField>
 */}            <TextField source="status" />
            <TextField source="currency" />
{/*             <TextField source="version" /> */}
            <BooleanField source="prices_include_tax" />
            <DateField source="date_created" />
           {/*  <DateField source="date_modified" /> */}
            <DateField source="date_paid" />
            <TextField source="discount_total" />
           {/*  <TextField source="discount_tax" /> */}
            <TextField source="shipping_total" />
           {/*  <TextField source="shipping_tax" /> */}
            {/* <TextField source="cart_tax" />
 */}            <TextField source="total" />
            <TextField source="total_tax" />
           {/*  <ReferenceField source="customer_id" reference="customers"><TextField source="id" /></ReferenceField> */}
           {/*  <TextField source="order_key" /> */}
           {/*  <TextField source="shipping.first_name" /> */}
            {/* <TextField source="payment_method" /> */}
            <TextField source="payment_method_title" />
           {/*  <ReferenceField source="transaction_id" reference="transactions"><TextField source="id" /></ReferenceField>
 */}{/*             <TextField source="customer_ip_address" />
 */}{/*             <TextField source="customer_user_agent" />
            <TextField source="created_via" />
 */}            <TextField source="customer_note" />
           {/*  <TextField source="date_completed" /> */}
           {/*  <TextField source="cart_hash" />
            <TextField source="number" /> */}
           {/*  <ArrayField source="meta_data"><SingleFieldList><ChipField source="id" /></SingleFieldList></ArrayField> */}
            <ArrayField source="line_items"><SingleFieldList><ChipField source="id" /></SingleFieldList></ArrayField>
            <ArrayField source="tax_lines"><SingleFieldList><ChipField source="id" /></SingleFieldList></ArrayField>
            <ArrayField source="shipping_lines"><SingleFieldList><ChipField source="id" /></SingleFieldList></ArrayField>
            <TextField source="fee_lines" />
           {/*  <TextField source="coupon_lines" /> */}
            <TextField source="refunds" />
           {/*  <TextField source="payment_url" />
            <DateField source="date_created_gmt" />
            <DateField source="date_modified_gmt" />
            <TextField source="date_completed_gmt" />
            <DateField source="date_paid_gmt" />
            <TextField source="currency_symbol" />
            <DateField source="_wcpdf_document_link" />
            <DateField source="_wc_order_key" />
            <ArrayField source="_links.self"><SingleFieldList><ChipField source="href" /></SingleFieldList></ArrayField> */}
        </Datagrid>
    </List>
);
export default WcOrderList;