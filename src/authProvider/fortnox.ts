import {
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_ERROR,
  AUTH_CHECK,
  AuthActionType,
} from "react-admin";
import {
  trySaveToken,
  loadToken,
  removeToken,
  sendOrUpdateToken,
} from "../utils/TokenUtils";
import axios from "axios";
import { isConstructorDeclaration } from "typescript";
import { createRecord } from "thin-backend";

import { FortnoxTokenConvert } from "../FortnoxTokenConvert";
import Token from "../Token";
import { stringify } from "querystring";
import { TokenConvert } from "../utils/TokenConvert";
import generateState from "../utils/generateState";

const authInitUri = "https://apps.fortnox.se/oauth-v1/auth";
const authTokenUri = "https://apps.fortnox.se/oauth-v1/token";
const authRevokeUri = "https://apps.fortnox.se/oauth-v1/auth";
const fortnoxApiUri = "https://api.fortnox.se/3/";
const apiUrl = "http://localhost:8080/fortnox";

const FORTNOX_SCOPES = process.env.REACT_APP_FORTNOX_SCOPES;
const FORTNOX_REDIRECT_URI = process.env.REACT_APP_FORTNOX_REDIRECT_URI;
const FORTNOX_CLIENT_ID = process.env.REACT_APP_FORTNOX_CLIENT_ID;

if (!FORTNOX_SCOPES)
  throw new Error(
    "Space delimited Fortnox Scopes missing in REACT_APP_FORTNOX_SCOPES."
  );
if (!FORTNOX_REDIRECT_URI)
  throw new Error("Missing Redirect URI in REACT_APP_FORTNOX_REDIRECT_URI");
if (!FORTNOX_CLIENT_ID)
  throw new Error("Missing Client Id in REACT_APP_FORTNOX_CLIENT_ID");

const refreshFortnoxToken = async (token: Token): Promise<void> => {
  if (!token.refreshToken) return Promise.reject();
  try {
    const newToken = await fetchFortnoxToken(
      token.refreshToken,
      "refresh_token"
    );
    console.log({ newToken });
    if (!newToken || !newToken.accessToken) throw Error();
    if (!trySaveToken(newToken)) return Promise.reject();

    // Send or update token in remote database
    sendOrUpdateToken(newToken, token.id);

    return Promise.resolve();
  } catch {
    console.log(
      `Failed to refresh token with 'refresh_token': ${token.refreshToken}`
    );
    removeToken(token);
    return Promise.reject();
  }
};

/**
 * Sanitize the scopes option to be a string.
 *
 * @param  {string | string[]}  scopes
 * @return {string}
 */
const sanitizeScope = (scopes: string | string[]): string =>
  Array.isArray(scopes) ? scopes.join(" ") : scopes;

const fetchFortnoxToken = async (
  code: string,
  grant_type: "authorization_code" | "refresh_token"
): Promise<Token | void> => {
  let body: {
    grant_type: string;
    code?: string;
    redirect_uri?: string;
    refresh_token?: string;
  } = {
    grant_type,
  };

  if (grant_type == "refresh_token") {
    body.refresh_token = code;
  } else {
    body.code = code;
    body.redirect_uri = FORTNOX_REDIRECT_URI;
  }
  const { data } = await axios({
    method: "POST",
    url: `${apiUrl}/token`,
    data: body,
    responseType: "json",
    headers: {
      Authorization: `Bearer ${code}`,
    },
    transformResponse: (r) => {
      if (typeof r === "string") return r;
      return JSON.stringify(r);
    },
  });

  let token = TokenConvert.toToken(data);
  const now = new Date();
  now.setSeconds(now.getSeconds() + token.expiresIn!);
  token.expiresAt = now.toISOString();
  return token;
};

const cleanup = () => {
  // Removes the query params '?code=&state=' from the URL
  window.history.replaceState(
    {},
    window.document.title,
    window.location.origin
  );
};

const createUri = (state: string, scopes: string | string[]): string => {
  const params = new URLSearchParams({
    client_id: FORTNOX_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    state,
    scope: sanitizeScope(scopes),
    redirect_uri: FORTNOX_REDIRECT_URI,
  });

  return `${authInitUri}?` + params.toString();
};

const fortnoxAuthProvider = async (
  type: unknown /* AuthActionType */,
  params: { code?: string; state?: string; status?: number; token?: Token } = {}
) => {
  if (type === AUTH_LOGIN) {
    if (params.token) {
      if (
        params.token.expiresAt &&
        Date.now() > new Date(params.token.expiresAt).getTime()
      ) {
        return await refreshFortnoxToken(params.token);
      }
      return Promise.resolve();
    }

    // 1. Redirect to the issuer to ask authentication
    if (!params.code || !params.state) {
      let state = generateState();

      // return Promise.resolve({ redirectTo: createUri(state, scopes) })
      //window.location.href = oauthClient.code.getUri({ state });

      const scopes = FORTNOX_SCOPES.split(" ");
      window.location.assign(createUri(state, scopes));

      //return Promise.reject({ message: 'Retrieving code from authentication service.', code: 'oauthRedirect' });
      return; // Do not return anything, the login is still loading
    }

    // 2. We came back from the issuer with ?code infos in query params

    // between the two redirections. But since we need to send it to the API
    // we have to retrieve it manually
    const state = localStorage.getItem(`fortnox.${params.state}`);
    if (!state || state !== params.state) {
      cleanup();
      return Promise.reject();
    }

    // Transform the code to a token via the API
    const token = await fetchFortnoxToken(params.code, "authorization_code");
    console.log({ token });
    if (!token) {
      cleanup();
      return Promise.reject();
    }

    if (!trySaveToken(token)) {
      return Promise.reject();
    }

    let { expiresAt, expiresIn, accessToken, refreshToken, scope, tokenType } =
      token;
    // Send token to database
    sendOrUpdateToken(token);

    cleanup();
    return Promise.resolve();
  }
  if (type === AUTH_LOGOUT) {
    localStorage.removeItem("token");
    return Promise.resolve();
  }
  if (type === AUTH_ERROR) {
    const status = params.status;
    // Missing credentials or invalid request
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      return Promise.reject();
    }
    return Promise.resolve();
  }
  if (type === AUTH_CHECK) {
    const token = params.token ?? loadToken();

    if (!token) {
      if (params.code && params.state) {
        return;
      }
      return Promise.reject();
    }
    // Invalid token
    if (!token.expiresAt) {
      return Promise.reject();
    }

    // Token expired, try refresh
    if (Date.now() >= new Date(token.expiresAt).getTime()) {
      return await refreshFortnoxToken(token);
    }
    return Promise.resolve();
  }

  return Promise.resolve();
};

export default fortnoxAuthProvider;
