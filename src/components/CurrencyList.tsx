import React from 'react';
import {
    Datagrid,
    DateField,
    List,
    NumberField,
    ReferenceField,
    TextField,
    useLocaleState,
} from 'react-admin';

export const CurrencyList = () => {
    const locale = useLocaleState();
    return (
        <List>
            <Datagrid rowClick="edit">
                {/* <ReferenceField source="id" reference="currency">
          <TextField source="id" />
        </ReferenceField> */}
                <DateField source="date" locales={'sv-SE'} />
                <NumberField source="currencyRate" />
                <TextField source="currencyFrom" />
                <TextField source="currencyTo" />
                {/* <DateField source="__v" /> */}
                {/* <TextField source="id" /> */}
            </Datagrid>
        </List>
    );
};
