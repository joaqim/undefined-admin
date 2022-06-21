import axios from 'axios';
import { fetchUtils } from 'ra-core';

const httpClient = (
    url: string,
    options?: {
        headers?: Headers;
        method?: 'POST' | 'GET' | 'PUSH';
        body?: string;
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
    return fetchUtils.fetchJson(url, options);
};

abstract class CurrencyUtils {
    public static async fetchCurrencyRate(
        date: Date,
        currencyTo: string,
        currencyFrom: string = 'SEK'
    ): Promise<number> {
        if (`${currencyTo}-${currencyFrom}` == 'SEK-SEK') {
            return 1;
        }
        const formatDate = (date: Date): string => {
            const addLeadingZeros = (n: number): string | number => {
                if (n <= 9) {
                    return '0' + n;
                }
                return n;
            };

            return (
                date.getFullYear() +
                '-' +
                addLeadingZeros(date.getMonth() + 1) +
                '-' +
                addLeadingZeros(date.getDate())
            );
        };

        const dateString = formatDate(date);

        const cacheKey = `${currencyTo}-${currencyFrom}_${dateString}`;

        const cacheCurrencyRate = localStorage.getItem(cacheKey) as string;

        if (typeof cacheCurrencyRate === 'string') {
            return parseFloat(cacheCurrencyRate);
        }
        const { json } = await httpClient('http://localhost:8080/currency', {
            method: 'POST',
            body: JSON.stringify({
                currencyFrom,
                currencyTo,
                date: dateString,
            }),
        });

        const currencyRate = json.currencyRate;

        localStorage.setItem(cacheKey, currencyRate);

        if (typeof currencyRate === 'string') return parseFloat(currencyRate);
        return currencyRate;
    }
}

export default CurrencyUtils;
