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

type Resources = "orders"

const get = async (resources: Resources, params: GetParams): Promise<any> => {
  const credentials = loadCredentials();
  if (!credentials) return Promise.reject();
  const { consumerKey, consumerSecret, storefrontUrl } = credentials;
  if (!consumerKey || !consumerSecret) return Promise.reject();
  const backendApiUrl = "http://localhost:8080";

  const { id, pagination, sort, filter } = params;

  const url = `${backendApiUrl}/retrieve/wc-${resources}/${id ? id : ""}`;
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
  getList: async (resource: Resources, params: GetListParams) => {
    try {
      return get(resource, params);
    } catch {
      return Promise.reject();
    }
  },
  getOne: (resource: Resources, params: GetOneParams) => {
    console.log("Get one" + params.id);
    try {
      get(resource, params.id);
    } catch {
      return Promise.reject();
    }
  },
  getMany: (resource: Resources, params: GetManyParams) => {
    return Promise.reject();
  },
  getManyReference: (resource: Resources, params: GetManyReferenceParams) => {
    return Promise.reject();
  },
  update: (resource: Resources, params: UpdateParams) => {
    return Promise.reject();
  },
  updateMany: (resource: Resources, params: UpdateManyParams) => {
    return Promise.reject();
  },
};

export default wooCommerceDataProvider;
