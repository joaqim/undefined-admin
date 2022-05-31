import { WooCredentials } from "../types";
import { TokenConvert } from "../utils/TokenConvert";
import { query, User } from "thin-backend";

export const saveWooCredentials = (credentials: WooCredentials) => {
  localStorage.setItem(
    "wooCredentials",
    TokenConvert.wooCredentialsToJson(credentials)
  );
};

export const removeWooCredentials = () => {
  localStorage.removeItem("woocommerce_keys");
};

export const loadWooCredentials = (): WooCredentials | undefined => {
  let json = localStorage.getItem("wooCredentials");
  if (!json) return;
  return TokenConvert.toWooCredentials(json);
};

export const tryFetchWooCredentials = async (
  user: User,
  storefront?: "GamerBulk - Live" | "Naudrinks - Live"
): Promise<WooCredentials> => {
  let keys = await query("woocommerce_keys")
    .where("userId", user.id)
    // .filterWhere("name", "Naudrinks - Live")
    .filterWhere("name", storefront ?? "GamerBulk - Live")
    .fetchOne();

  return keys as WooCredentials;
};
