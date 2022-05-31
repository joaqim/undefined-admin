import { deleteRecord, updateRecord, createRecord } from "thin-backend";
import Token from "../Token";
import { TokenConvert } from "./TokenConvert";

export const tryValidateToken = (token: Token): Token | undefined => {
  if (!token.expiresIn) {
    throw new Error("Fortnox Token is missing 'expiresIn', expected: 3600");
    //console.log("Fortnox Token is missing 'expiresIn', expected: 3600");
    //return false;
  } else if (
    token.expiresAt &&
    new Date(token.expiresAt).getTime() < Date.now()
  ) {
    new Error(
      `Fortnox Token has expired: ${new Date(token.expiresAt).toLocaleString()}`
    );
  }
  return token;
};

export const trySaveToken = (token: Token | undefined): Token | undefined => {
  if (!token) throw new Error("Tried to save undefined Token");

  tryValidateToken(token);
  localStorage.setItem("token", TokenConvert.tokenToJson(token));
  window.dispatchEvent(new Event("new_fortnox_token"));
  return token;
};

export const loadToken = (): Token | undefined => {
  const json = localStorage.getItem("token") as string;
  if (json) {
    return TokenConvert.toToken(json);
  }
};
export const removeToken = (token?: Token | undefined) => {
  if (token?.id) deleteRecord("fortnox_tokens", token.id);

  localStorage.removeItem("token");
};

export const sendOrUpdateToken = (token: Token, userId: string) => {
  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
  let updatedToken = {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    expiresAt: token.expiresAt,
    expiresIn: token.expiresIn,
    scope: token.scope ?? process.env.REACT_APP_FORTNOX_SCOPES,
  };
  token.id
    ? updateRecord("fortnox_tokens", token.id, updatedToken)
    : createRecord("fortnox_tokens", { ...updatedToken, id: uuidv4(), userId });
};
