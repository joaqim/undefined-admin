import { createRecord } from "thin-backend";
import { Convert, TokenInfo } from "./tokenInfo";

export const saveToken = (token: TokenInfo | undefined) => {
    if (!token) throw new Error("Tried to save undefined Token");

    if (!token.expires_at) {
        let now = Date.now();
        token.expires_at = now + (token.expires_in * 1000);
    }

    localStorage.setItem('token', Convert.tokenInfoToJson(token));
    window.dispatchEvent(new Event("new_fortnox_token"));
    createRecord('fortnox_tokens', {
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        // expiresAt: new Date(token.expires_at).toISOString().slice(0, 19).replace('T', ' '),
        expiresAt: new Date(token.expires_at).toISOString(),
        scopes: process.env.REACT_APP_FORTNOX_SCOPES!
    })
    console.log({token})
}

export const loadToken = (): TokenInfo | null => {
    const json = localStorage.getItem('token') as string;
    if (json) {
        return Convert.toTokenInfo(json)
    }
    return null
}