import React from 'react';
import { Admin, ListGuesser, Resource } from 'react-admin';
import AuthenticateFortnoxPage from './AuthenticateFortnoxPage';
import { fortnoxAuthProvider } from './authProvider';
import { fortnoxDataProvider, wooCommerceDataProvider } from './dataProvider';
import InvoiceList from './invoices/InvoiceList';
import { Layout } from './layout';

import InvoiceIcon from '@mui/icons-material/Book';
import ArticleIcon from '@mui/icons-material/Storefront';
import OrderIcon from '@mui/icons-material/Receipt';
import CustomerIcon from '@mui/icons-material/Group';
import { ArticleList } from './articles/ArticleList';
import { CustomerList } from './customers/CustomerList';
import CompositeDataProvider from './common/CompositeDataProvider';
import WcOrderList from './orders/WcOrderList';
import CompositeAuthProvider from './common/CompositeAuthProvider';
import authProvider from './authProvider/authProvider';
import { AuthProvider } from 'ra-core';

const dataProvider = new CompositeDataProvider([
    {
        dataProvider: fortnoxDataProvider,
        resources: ['invoices', 'articles', 'customers'],
    },
    {
        dataProvider: wooCommerceDataProvider,
        resources: ['orders'],
    },
]);

/*
const authProviderComposite = new CompositeAuthProvider([
    {
        authProvider,
        resources: ['orders'],
    },
    {
        authProvider: fortnoxAuthProvider as AuthProvider,
        resources: ['invoices', 'articles', 'customers'],
    },
]);
*/

export const FortnoxPage = () => (
    <Admin
        authProvider={fortnoxAuthProvider}
        dataProvider={fortnoxDataProvider}
        loginPage={AuthenticateFortnoxPage}
        /* layout={Layout} */

        disableTelemetry
    >
        <Resource name="invoices" list={InvoiceList} icon={InvoiceIcon} />
        <Resource name="articles" list={ArticleList} icon={ArticleIcon} />
        <Resource name="orders" list={WcOrderList} icon={OrderIcon} />
        <Resource name="customers" list={CustomerList} icon={CustomerIcon} />
    </Admin>
);
