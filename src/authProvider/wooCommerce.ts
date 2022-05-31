import { AUTH_CHECK, AUTH_ERROR, AUTH_LOGIN, AUTH_LOGOUT } from "ra-core";
import { WooCredentials } from "../types";
import {
  loadWooCredentials,
  removeWooCredentials,
  saveWooCredentials,
} from "../utils/WooCommerce";

const wooCommerceAuthProvider = async (
  type: unknown,
  params: { credentials?: WooCredentials; status?: number } = {}
) => {
  let { credentials } = params;
  if (type === AUTH_LOGIN) {
    if (credentials) {
      saveWooCredentials(credentials);
      return Promise.resolve();
    }
    return Promise.reject();
  } else if (type === AUTH_LOGOUT) {
    removeWooCredentials();
  } else if (type === AUTH_ERROR) {
    const status = params.status;
    // Missing credentials or invalid request
    if (status === 401 || status === 403) {
      removeWooCredentials();
      return Promise.reject();
    }
    return Promise.resolve();
  } else if (type === AUTH_CHECK) {
    return loadWooCredentials() ? Promise.resolve() : Promise.reject();
  }
};

export default wooCommerceAuthProvider;
