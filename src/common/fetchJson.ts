import { fetchUtils } from 'ra-core';

const fetchJson = (
    url: string,
    options?: {
        headers?: Headers;
        method?: 'POST' | 'GET';
        body?: string | Record<string, string>;
    }
) => {
    if (!options) {
        options = {};
    }
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const { accessToken } = JSON.parse(localStorage.getItem('auth') as string);
    options.headers.set('Authorization', `Bearer ${accessToken}`);
    // add your own headers here
    options.headers.set('Access-Control-Expose-Headers', 'Content-Range');

    if (typeof options.body !== 'string') {
        options.body = JSON.stringify(options.body);
    }

    return fetchUtils.fetchJson(url, {
        ...options,
        body: options.body as string,
    });
};

export default fetchJson;
