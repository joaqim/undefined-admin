import { WoocommerceKey } from "thin-backend";

export default interface WooCredentials extends Partial<WoocommerceKey> {
  consumerKey?: string;
  consumerSecret?: string;
  storefrontUrl?: string;
  storefrontPrefix?: string;
  name?: string;
}
