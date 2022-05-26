import { deleteRecord, updateRecord, createRecord } from "thin-backend";
import Token from "../Token";
import { TokenConvert } from "./TokenConvert";

export const tryValidateToken = (token: Token): boolean => {
  if (!token.expiresIn) {
    // throw new Error("Fortnox Token is missing 'expiresIn', expected: 3600")
    console.log("Fortnox Token is missing 'expiresIn', expected: 3600");
    return false;
  } else if (
    token.expiresAt &&
    new Date(token.expiresAt).getTime() < Date.now()
  ) {
    console.log("Token has expired");
    return false;
  }
  return true;
};

export const saveToken = (token: Token | null): boolean => {
  if (!token) throw new Error("Tried to save null Token");

  try {
    tryValidateToken(token);
    localStorage.setItem("token", TokenConvert.tokenToJson(token));
    window.dispatchEvent(new Event("new_fortnox_token"));
    return true;
  } catch {}
  return false;
};

export const loadToken = (): Token | null => {
  const json = localStorage.getItem("token") as string;
  if (json) {
    return TokenConvert.toToken(json);
  }
  return null;
};
export const removeToken = (token?: Token | undefined) => {
  if (token?.id) deleteRecord("fortnox_tokens", token.id);

  localStorage.removeItem("token");
};

export const sendOrUpdateToken = (token: Token, id?: string | undefined) => {
  let updatedToken = {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    expiresAt: token.expiresAt,
    expiresIn: token.expiresIn,
    scope: token.scope ?? process.env.REACT_APP_FORTNOX_SCOPES,
  };
  id
    ? updateRecord("fortnox_tokens", id, updatedToken)
    : createRecord("fortnox_tokens", updatedToken);
};
