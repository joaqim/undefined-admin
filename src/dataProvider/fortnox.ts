import axios from 'axios';
import { stringify } from 'query-string';
import type {
    CreateParams,
    DataProvider,
    DeleteManyParams,
    DeleteParams,
    GetListParams,
    GetManyParams,
    GetManyReferenceParams,
    GetOneParams,
    Options,
    UpdateManyParams,
    UpdateParams,
} from 'ra-core';
import { fetchUtils } from 'react-admin';
import fetchJson from '../common/fetchJson';
import { loadToken, trySaveToken } from '../utils/TokenUtils';

const fortnoxApiUrl = 'https://api.fortnox.se/3';
const backendApiUrl = 'http://localhost:8080/fortnox';

const generateUrl = (url: string, ...params: unknown[]) => {
    const query = stringify({ ...params });
    return `${url}?${query}`;
};

/*
const headers = (data?: string | null) => { //: Headers & Record<'Access-Token', string> & Record<'Client-Secret', string> => {
    data = localStorage.getItem('auth')
    let auth = JSON.parse(data!) as ClientOAuth2.Data;
    console.log('oauth')
    return new Headers(
        {
            'Access-Token': auth.code,
            'Client-Secret': clientSecret,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    )
}*/

type Resources = 'invoices' | 'customers' | 'articles' | 'orders';

type InvoiceFilters =
    | 'cancelled'
    | 'fullypaid'
    | 'unpaid'
    | 'unpaidoverdue'
    | 'unbooked';

interface GlobalSearch {
    lastmodfied: string; // 2022-01-01 01:00
    financialyear: string; // 1
    financialyeardate: string; // 2022-03-06

    // Only for Invoices and Orders:
    fromdate: string; // 2022-03-06
    toDate: string; // 2022-03-06
}

// TODO: Switch to using capitalized 'resources' string
const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

type GetParams = Partial<GetListParams & GetOneParams>;

const get = async (resource: string, params: GetParams) => {
    const token = loadToken();
    if (!token) {
        return Promise.reject();
    }
    return Promise.resolve({ data: Array.from({ length: 0 }), total: 0 });
    // trySaveToken(token);

    const { id, pagination, sort, filter } = params;
    const { page, perPage } = pagination ?? { page: 1, perPage: 5 };

    const url = `${backendApiUrl}/${resource}/${id ? id : ''}`;
    /*
  const { data } = await axios({
    method: "GET",
    url,
    params: {
      access_token: token.access_token,
      page,
      per_page: perPage,
      sort,
      filter,
    },
    responseType: "json",
  });
  */

    const { json } = await fetchJson(url, {
        method: 'POST',
        body: {
            token,
            access_token: token.access_token,
            page: page.toString(),
            perPage: perPage.toString(),
            // sort,
            filter,
        },
    });
    /* console.log({ json }); */
    return json;
    /*
  const resourceArray = data[capitalizeFirstLetter(resource)] as unknown[];
  return { data: resourceArray, total: resourceArray.length };
  */
    //console.log({data})
    /*
  return {
    //{ ...item, id: item.DocumentNumber }
    data: (data as object[]).map((value) => {return {...value, id: value.DocumentNumber}})
    total: parseInt(headers.get("content-range").split("/").pop(), 10),
  };
  */
    //return {data, total: data.length}
};

//export default <DataProvider<Resources>>{
const fortnoxDataProvider = <DataProvider<string>>{
    getList: async (resource: string, params: GetListParams) => {
        return get(resource, params);
    },
    getOne: (resource: string, params: GetOneParams) => {
        return get(resource, params);
    },
    getMany: (resource: string, params: GetManyParams) => {
        return Promise.reject();
    },
    getManyReference: (resource: string, params: GetManyReferenceParams) => {
        return Promise.reject();
        /*
        return httpClient('').then(({ headers, json }: { headers: Map<string, string>, json: string }) => ({
            data: json, total: parseInt(
                headers.get('content-range')?.split('/')!.pop()!
                , 10)
        }));
        */
    },
    update: (resource: string, params: UpdateParams) => {
        return Promise.reject();
        /*
        return httpClient(`${fortnoxApiUrl}/${resource}/${params.id}`, { method: 'PUT', body: JSON.stringify(params.data) }).then(({ json }: { json: string }) => ({ data: json }))
        */
    },
    updateMany: (resource: string, params: UpdateManyParams) => {
        return Promise.reject();
        /*
        const query = {
            filter: JSON.stringify({ id: params.ids })
        }
        return httpClient(generateUrl(`${fortnoxApiUrl}/${resource}`, query),
            {
                method: 'PUT',
                body: JSON.stringify(params.data),
            }).then(({ json }: { json: string }) => ({ data: { ...params.data, id: json.id } }))
            */
    },
    create: (resource: string, params: CreateParams) => {
        return Promise.reject();
        /*
        return httpClient(`${fortnoxApiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }: { json: string }) => ({
            data: { ...params.data, id: json.id },
        }))
        */
    },
    delete: (resource: string, params: DeleteParams) => {
        return Promise.reject();
        /*
        return httpClient(`${fortnoxApiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }: { json: string }) => ({ data: json }))
        */
    },

    deleteMany: (resource: string, params: DeleteManyParams) => {
        return Promise.reject();
        /*
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        return httpClient(`${fortnoxApiUrl}/${resource}?${stringify(query)}`, {
            method: 'DELETE',
        }).then(({ json }: { json: string }) => ({ data: json }));
        */
    },
};

export default fortnoxDataProvider;
