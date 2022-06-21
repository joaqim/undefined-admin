import React from 'react';
import { Create, SelectInput, SimpleForm, TextInput } from 'react-admin';

const providers = [
    { _id: 0, name: 'Woo Commerce', value: 'woo' },
    { _id: 1, name: 'Fortnox', value: 'fortnox' },
];
export const CredentialsForm = () => (
    <Create>
        <SimpleForm>
            <SelectInput
                source="provider"
                choices={providers}
                optionText="name"
                optionValue="value"
            />
            <TextInput source="clientIdentity" />
            <TextInput source="clientSecret" />
            <TextInput source="storefrontUrl" />
            <TextInput source="storefrontPrefix" />
        </SimpleForm>
    </Create>
);
