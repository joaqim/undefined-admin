import { WooCredentials } from "../types";
import { TokenConvert } from "../utils/TokenConvert";
import { query, User } from "thin-backend";

export const saveCredentials = (credentials: WooCredentials) => {
  localStorage.setItem(
    "wooCredentials",
    TokenConvert.wooCredentialsToJson(credentials)
  );
};

export const removeCredentials = () => {
  localStorage.removeItem("woocommerce_keys");
};

export const loadCredentials = (): WooCredentials | undefined => {
  let json = localStorage.getItem("wooCredentials");
  if (!json) return;
  return TokenConvert.toWooCredentials(json);
};

export const tryFetchWooCommerceCredentials = async (
  user: User
): Promise<WooCredentials> => {
  let keys = await query("woocommerce_keys")
    .where("userId", user.id)
    // .filterWhere("name", "Naudrinks - Live")
    .filterWhere("name", "GamerBulk - Live")
    .fetchOne();

  return keys as WooCredentials;
};
