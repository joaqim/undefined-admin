import {
    deleteRecord,
    updateRecord,
    createRecord,
    FortnoxToken,
} from 'thin-backend';
import Token from '../Token';
import { TokenConvert } from './TokenConvert';

export const tryValidateToken = (token: any): any | undefined => {
    if (!token.expires_in) {
        throw new Error(
            "Fortnox Token is missing value of 'expires_in', expected: 3600"
        );
        //console.log("Fortnox Token is missing 'expiresIn', expected: 3600");
        //return false;
    } else if (
        token.expires_at &&
        new Date(token.expires_at).getTime() < Date.now()
    ) {
        new Error(
            `Fortnox Token has expired: ${new Date(
                token.expires_at
            ).toLocaleString()}`
        );
    }
    return token;
};

export const trySaveToken = (token: any): any => {
    if (!token) throw new Error('Tried to save undefined Token');
    tryValidateToken(token);
    localStorage.setItem('token', JSON.stringify(token));
    window.dispatchEvent(new Event('new_fortnox_token'));
    return token;
};

export const loadToken = (): any => {
    const json = localStorage.getItem('token') as string;
    if (json) {
        return JSON.parse(json);
    }
};
export const removeToken = () => {
    localStorage.removeItem('token');
};
