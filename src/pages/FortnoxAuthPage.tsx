import { Card, CardContent, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link, Title } from 'react-admin';
import fetchJson from '../common/fetchJson';

const cleanup = () => {
    // Removes the query params '?code=&state=' from the URL
    window.history.replaceState(
        {},
        window.document.title,
        window.location.origin
    );
};

const FortnoxAuthPage = () => {
    const [authUrl, setAuthUrl] = useState<string | null>(null);
    const [fortnoxState, setFortnoxState] = useState<string | null>(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);

        const code = queryParams.get('code');
        const state = queryParams.get('state');

        if (!state || state !== fortnoxState) {
            cleanup();
            return;
        }

        if (!authUrl) {
            fetchJson('http://localhost:8080/fortnox/auth/url', {
                method: 'POST',
                body: {
                    redirectUri: 'http://localhost:3000/fortnox/auth',
                    scopes: 'companyinformation',
                },
            })
                .then(({ json }) => {
                    const { uri, state } = json;

                    localStorage.setItem(`fortnox.${state}`, state);
                    setFortnoxState(state);
                    setAuthUrl(uri);
                })
                .catch(({ body }) => {
                    console.log({ errors: body.errors });
                });
        }
    });

    const redirectTo = (url: string) => {
        window.location.assign(url);
    };

    return (
        <Card>
            <Title title="Fortnox Authentication Page" />
            <CardContent>
                {authUrl && (
                    <Button
                        onClick={() => {
                            redirectTo(authUrl);
                        }}
                    >
                        Auth
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default FortnoxAuthPage;
