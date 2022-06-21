import React from 'react';
import { Datagrid, List, TextField } from 'react-admin';

export const CredentialsList = () => (
    <List>
        <Datagrid>
            <TextField source="provider" />
            <TextField source="clientIdentity" />
            <TextField source="storefrontUrl" />
            <TextField source="storefrontPrefix" />
        </Datagrid>
    </List>
);
