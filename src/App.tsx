import React from 'react';
import { Admin, CustomRoutes, ListGuesser, Resource } from 'react-admin';
import { QueryClient } from 'react-query';
import { Route } from 'react-router-dom';
import authProvider from './authProvider/authProvider';
import { CurrencyForm } from './components/CurrencyForm';
import { CurrencyList } from './components/CurrencyList';
import { UsersList } from './components/UsersList';
import dataProvider from './dataProvider/dataProvider';

import { Create, SimpleForm, TextInput, NumberInput } from 'react-admin';
import { CredentialsForm } from './components/CredentialsForm';
import { CredentialsList } from './components/CredentialsList';
import WcOrderList from './orders/WcOrderList';
import FortnoxAuthPage from './pages/FortnoxAuthPage';
import { FortnoxPage } from './FortnoxPage';
import UtilityPage from './pages/UtilityPage';

const MainPage = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 60 * 1000, // 1h, only for testing
            },
        },
    });
    return (
        <Admin
            dataProvider={dataProvider}
            authProvider={authProvider}
            queryClient={queryClient}
        >
            {/* <Resource name="users" list={UsersList} /> */}
            <Resource
                name="currency"
                list={CurrencyList}
                create={CurrencyForm}
            />
            <Resource
                name="credentials"
                /* list={ListGuesser} */
                list={CredentialsList}
                create={CredentialsForm}
            />
            <Resource name="orders" list={WcOrderList} />
            <CustomRoutes>
                <Route path="/util" element={<UtilityPage />} />
            </CustomRoutes>
        </Admin>
    );
};

const App = () => (
    <>
        <MainPage />
        {/* <CustomRoutes>
            <Route path="/fortnox" element={<FortnoxPage />} />
        </CustomRoutes> */}
        <FortnoxPage />
        {/* <CustomRoutes>
            <Route path="/fortnox" element={<FortnoxPage />} />
        </CustomRoutes> */}
    </>
);
export default App;
