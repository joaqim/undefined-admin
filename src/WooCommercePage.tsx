import React from "react"
import { Admin, Resource } from "react-admin"
import { wooCommerceAuthProvider } from "./authProvider"
import { wooCommerceDataProvider } from "./dataProvider"
import { WcOrderList } from "./orders/WcOrderList"

export const WooCommercePage = () => (
    <Admin authProvider={wooCommerceAuthProvider} dataProvider={wooCommerceDataProvider}
        disableTelemetry
        >
        <Resource name="orders" list={WcOrderList} />
    </Admin>
);