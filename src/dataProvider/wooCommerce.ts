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

type GetParams = Partial<GetListParams & GetOneParams>;

const get = async (resources: string, params: GetParams): Promise<any> => {
  const credentials = loadCredentials();
  if (!credentials) return Promise.reject();
  const { consumerKey, consumerSecret, storefrontUrl } = credentials;
  if (!consumerKey || !consumerSecret) return Promise.reject();
  const backendApiUrl = "http://localhost:8080";

  const { id, pagination, sort, filter } = params;

  const url = `${backendApiUrl}/wc-${resources}/${id ? id : ""}`;
  const { data } = await axios({
    method: "POST",
    url,
    data: {
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      storefront_url: storefrontUrl,
      sort, // {field: string, order: string}
      filter, // {[k: string]: any}
      pagination, // {page: number, perPage: number}
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
      return get(resource, params);
    } catch {
      return Promise.reject();
    }
  },
  getOne: (resource: string, params: GetOneParams) => {
    console.log("Get one" + params.id);
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
