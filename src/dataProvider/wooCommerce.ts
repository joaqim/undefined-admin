import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import axios from "axios";
import {
  DataProvider,
  GetListParams,
  GetManyParams,
  GetManyReferenceParams,
  GetOneParams,
  UpdateManyParams,
  UpdateParams,
} from "ra-core";
import { loadCredentials } from "../utils/WooCommerce";

const get = async (resources: string, id?: number): Promise<any> => {
  const credentials = loadCredentials();
  if (!credentials) return Promise.reject();
  const { consumerKey, consumerSecret, storefrontUrl } = credentials;
  if (!consumerKey || !consumerSecret) return Promise.reject();
  const backendApiUrl = "http://localhost:8080";

  const url = `${backendApiUrl}/wc-${resources}/${id ? id : ""}`;
  const { data } = await axios({
    method: "POST",
    url,
    data: {
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      storefront_url: storefrontUrl
    },
    responseType: "json",
  });

  console.log({ data });
  return { data, total: data.length };

  /*
  const api = new WooCommerceRestApi({
    url: "http://naudrinks.com",
    consumerKey,
    consumerSecret,
    version: "wc/v3",
  });
  return await api.get(resource + id ? `/${id}` : "", { per_page: 5 });
  */
};

const wooCommerceDataProvider = <DataProvider<string>>{
  getList: async (resource: string, params: GetListParams) => {
    try {
      return get(resource);
    } catch {
      return Promise.reject();
    }
  },
  getOne: (resource: string, params: GetOneParams) => {
    console.log("Get one" + params.id)
    try {
      get(resource, params.id);
    } catch {
      return Promise.reject();
    }
  },
  getMany: (resource: string, params: GetManyParams) => {
    return Promise.reject();
  },
  getManyReference: (resource: string, params: GetManyReferenceParams) => {
    return Promise.reject();
  },
  update: (resource: string, params: UpdateParams) => {
    return Promise.reject();
  },
  updateMany: (resource: string, params: UpdateManyParams) => {
    return Promise.reject();
  },
};

export default wooCommerceDataProvider;
