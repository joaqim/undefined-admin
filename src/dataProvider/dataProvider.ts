import {
    CreateParams,
    CreateResult,
    DataProvider,
    DeleteManyParams,
    DeleteManyResult,
    DeleteParams,
    DeleteResult,
    fetchUtils,
    GetListParams,
    GetListResult,
    GetManyParams,
    GetManyReferenceParams,
    GetManyReferenceResult,
    GetManyResult,
    GetOneParams,
    GetOneResult,
    RaRecord,
    UpdateManyParams,
    UpdateManyResult,
    UpdateParams,
    UpdateResult,
} from 'ra-core';
import fetchJson from '../common/fetchJson';

const apiUrl = 'http://localhost:8080';

const isManyParams = (
    params: GetListParams | GetManyParams
): params is GetManyParams => (params as GetManyParams).ids !== undefined;

const generateUrl = (
    resource: string,
    params: GetListParams | GetManyParams
): string => {
    if (isManyParams(params)) {
        if (params.ids.length === 1) {
            return `${apiUrl}/${resource}?${JSON.stringify(params.ids)}`;
        }
        return `${apiUrl}/${resource}/${params.ids[0].toString()}`;
    }
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const queryParams = new URLSearchParams({
        //sort: JSON.stringify([field, order]),
        //range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
        filter: JSON.stringify(params.filter),
        page: page.toString(),
        perPage: perPage.toString(),
    });
    return `${apiUrl}/${resource}?${queryParams.toString()}`;
};
const getHeaderTotal = (headers: Headers) => {
    const total = headers.get('Content-Range')?.split('/').pop();
    if (total) return parseInt(total, 10);
};

const getSome = (resource: string, params: GetListParams | GetManyParams) => {
    const url = generateUrl(resource, params);
    return fetchJson(url)
        .then(({ headers, json }) => {
            if (resource === 'orders') {
                return {
                    data: json.data,
                    total: getHeaderTotal(headers) ?? json.length,
                };
            }

            if (Array.isArray(json)) {
                json.forEach((item: unknown & { id?: string; _id: string }) => {
                    if (!item.id) item.id = item._id; //index.toString();
                });
                return {
                    data: json,
                    total: getHeaderTotal(headers) ?? json.length,
                };
            }

            return {
                data: [{ ...json, id: json._id }],
                total: 1,
            };
        })
        .catch(({ body }) => {
            if (body?.errors) {
                console.log(body.errors);
                return {
                    data: [],
                    total: 0,
                    errors: body.errors,
                };
            }
            return {
                data: [],
                total: 0,
                errors: ['Unknown error occured.'],
            };
        });
};
const create = (resource: string, params: CreateParams<any>) => {
    return fetchJson(`${apiUrl}/${resource}`, {
        method: 'POST',
        body: JSON.stringify(params.data),
    }).then(({ json }) => ({
        data: { ...params.data, id: json.id },
    }));
};

const dataProvider: DataProvider = {
    getList: function <RecordType extends RaRecord = any>(
        resource: string,
        params: GetListParams
    ): Promise<GetListResult<RecordType>> {
        return getSome(resource, params);
    },
    getOne: function <RecordType extends RaRecord = any>(
        resource: string,
        params: GetOneParams<any>
    ): Promise<GetOneResult<RecordType>> {
        return Promise.reject();
    },
    getMany: function <RecordType extends RaRecord = any>(
        resource: string,
        params: GetManyParams
    ): Promise<GetManyResult<RecordType>> {
        return getSome(resource, params);
    },
    getManyReference: function <RecordType extends RaRecord = any>(
        resource: string,
        params: GetManyReferenceParams
    ): Promise<GetManyReferenceResult<RecordType>> {
        return Promise.reject();
    },
    update: function <RecordType extends RaRecord = any>(
        resource: string,
        params: UpdateParams<any>
    ): Promise<UpdateResult<RecordType>> {
        return Promise.reject();
    },
    updateMany: function <RecordType extends RaRecord = any>(
        resource: string,
        params: UpdateManyParams<any>
    ): Promise<UpdateManyResult<RecordType>> {
        return Promise.reject();
    },
    create: function <RecordType extends RaRecord = any>(
        resource: string,
        params: CreateParams<any>
    ): Promise<CreateResult<RecordType>> {
        return create(resource, params);
    },
    delete: function <RecordType extends RaRecord = any>(
        resource: string,
        params: DeleteParams<RecordType>
    ): Promise<DeleteResult<RecordType>> {
        return Promise.reject();
    },
    deleteMany: function <RecordType extends RaRecord = any>(
        resource: string,
        params: DeleteManyParams<RecordType>
    ): Promise<DeleteManyResult<RecordType>> {
        return Promise.reject();
    },
};

export default dataProvider;
