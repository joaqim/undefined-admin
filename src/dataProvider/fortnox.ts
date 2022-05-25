import axios from "axios"
import { stringify } from "query-string"
import type { CreateParams, DataProvider, DeleteManyParams, DeleteParams, GetListParams, GetManyParams, GetManyReferenceParams, GetOneParams, Options, UpdateManyParams, UpdateParams } from "ra-core"
import { fetchUtils } from "react-admin"
import { loadToken, saveToken } from "../TokenUtils"

const fortnoxApiUrl = "https://api.fortnox.se/3"
const backendApiUrl = "http://localhost:8080"

const generateUrl = (url: string, ...params: unknown[]) => {
    const query = stringify({ ...params })
    return `${url}?${query}`
}

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

type SortOrders = 'ascending' | 'descending' | null
type Resources = "invoice" | "customer" | "article" | "order"

//const httpClient = fetchUtils.fetchJson;


const httpClient = (url: string, options?: { headers?: Headers }) => {
    if (!options) {
        options = {}
    }
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    // add your own headers here
    options.headers.set('Access-Control-Expose-Headers', 'Content-Range')
    return fetchUtils.fetchJson(url, options);
};

const capitalizeFirstLetter = (str: string):string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const get = async (resource: string, id?: number) => {
    const token = loadToken()
    if (!token) {
        return Promise.reject()
    }
    saveToken(token)
    const url = `${backendApiUrl}/${resource}/${id ? id : ""}`
    const { data } = await axios({
        method: 'POST',
        url,
        data: {
            access_token: token.accessToken
        },
        /*params: {
            access_token: token.access_token
        },*/
        responseType: 'json',
    })
    const resourceArray = data[capitalizeFirstLetter(resource)] as unknown[]
    return { data: resourceArray, total: resourceArray.length }
}

//export default <DataProvider<Resources>>{
const fortnoxDataProvider = <DataProvider<string>>{
    getList: async (resource: string, params: GetListParams) => {
        /*
        if(resource = "dummy")
            return Promise.resolve({ data: [{ id: 'id', name: 'Dummy', date: new Date() }], total: 1 });
        */

        return get(resource)
        /*

        const { data } = await axios({
            method: 'POST',
            url: `${apiUrl}/invoices`,
            data: {
                access_token: token.access_token
                // code: params.code,
                //access_token
                // client_secret
            },
            params: {
                access_token: token.access_token
            },
            responseType: 'json',
            headers: {
                // 'Authorization': `Bearer ${params.code}`
            }
        })
        return { data: data.Invoices, total: data.Invoices.length }
        */

        /*
        const url = generateUrl(`${apiUrl}/${resource}`,
            sort: JSON.stringify([field, order])
        );
        */
        /*
        console.log({ resource, params })
        const url = `${fortnoxApiUrl}/${resource}`
        return httpClient(url
        ).then(({ json }: { json: string }) => {
            console.log(JSON.parse(json))
            return Promise.resolve({ data: json })
        }
        ).catch((reason: any) => {
            console.log(reason)
            return Promise.reject();
        })
        */
    },
    getOne: (resource: string, params: GetOneParams) => {
        return Promise.reject()
        return httpClient(`${fortnoxApiUrl}/${resource}/${params.id}`,
        ).then(({ json }: { json: string }) => ({ data: json }))
    },
    getMany: (resource: string, params: GetManyParams) => {

        return Promise.reject()
        const url = generateUrl(`${fortnoxApiUrl}/${resource}`,
            params
        );
        return httpClient(url,
        ).then(({ json }: { json: string }) => ({ data: json }))
    },
    getManyReference: (resource: string, params: GetManyReferenceParams) => {
        return Promise.reject()
        /*
        return httpClient('').then(({ headers, json }: { headers: Map<string, string>, json: string }) => ({
            data: json, total: parseInt(
                headers.get('content-range')?.split('/')!.pop()!
                , 10)
        }));
        */
    },
    update: (resource: string, params: UpdateParams) => {
        return Promise.reject()
        /*
        return httpClient(`${fortnoxApiUrl}/${resource}/${params.id}`, { method: 'PUT', body: JSON.stringify(params.data) }).then(({ json }: { json: string }) => ({ data: json }))
        */
    },
    updateMany: (resource: string, params: UpdateManyParams) => {
        return Promise.reject()
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
        return Promise.reject()
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
        return Promise.reject()
        /*
        return httpClient(`${fortnoxApiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }: { json: string }) => ({ data: json }))
        */
    },

    deleteMany: (resource: string, params: DeleteManyParams) => {
        return Promise.reject()
        /*
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        return httpClient(`${fortnoxApiUrl}/${resource}?${stringify(query)}`, {
            method: 'DELETE',
        }).then(({ json }: { json: string }) => ({ data: json }));
        */
    }
}

export default fortnoxDataProvider;
