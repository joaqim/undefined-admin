import { deleteRecord } from "thin-backend";
import Token from "./Token";
import { TokenConvert } from "./TokenConvert";

export const tryValidateToken = (token: Token) => {
    if (!token.expiresIn) {
        throw new Error("Fortnox Token is missing 'expiresIn', expected: 3600")
    } else if (token.expiresAt && new Date(token.expiresAt).getTime() < Date.now()) {
        throw new Error("Token has expired");
    }
}

export const saveToken = (token: Token | null) => {
    if (!token) throw new Error("Tried to save null Token");

    tryValidateToken(token)

    localStorage.setItem('token', TokenConvert.tokenToJson(token));
    window.dispatchEvent(new Event("new_fortnox_token"));
}

export const loadToken = (): Token | null => {
    const json = localStorage.getItem('token') as string;
    if (json) {
        return TokenConvert.toToken(json)
    }
    return null
}
export const removeToken = (token?: Token | undefined) => {
    if (token?.id) deleteRecord('fortnox_tokens', token.id)

    localStorage.removeItem('token')
}