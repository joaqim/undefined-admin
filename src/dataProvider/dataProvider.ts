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
} from "ra-core";
import { json } from "stream/consumers";

const httpClient = (
  url: string,
  options?: {
    headers?: Headers;
    method?: "POST" | "GET" | "PUSH";
    body?: string;
  }
) => {
  if (!options) {
    options = {};
  }
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  const { accessToken } = JSON.parse(localStorage.getItem("auth") as string);
  options.headers.set("Authorization", `Bearer ${accessToken}`);
  // add your own headers here
  options.headers.set("Access-Control-Expose-Headers", "Content-Range");
  return fetchUtils.fetchJson(url, options);
};
const apiUrl = "http://localhost:8080";

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
  let query = {};

  const { page, perPage } = params.pagination;
  const { field, order } = params.sort;
  query = {
    sort: JSON.stringify([field, order]),
    range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
    filter: JSON.stringify(params.filter),
  };
  return `${apiUrl}/${resource}?${JSON.stringify(query)}`;
};

const getSome = (resource: string, params: GetListParams | GetManyParams) => {
  const url = generateUrl(resource, params);
  return httpClient(url).then(({ headers, json }) => {
    if (Array.isArray(json)) {
      json.forEach(
        (item: unknown & { id?: string; _id: string }) => {
          if (!item.id) item.id = item._id; //index.toString();
        }
      );
      return {
        data: json,
        total: parseInt(
          headers.get("content-range")?.split("/").pop() ??
            json.length.toString(),
          10
        ),
      };
    }

    return {
      data: [{ ...json, id: json._id }],
      total: 1,
    };
  });
};
const create = (resource: string, params: CreateParams<any>) => {
  return httpClient(`${apiUrl}/${resource}`, {
    method: "POST",
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
    throw new Error("Function not implemented.");
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
    throw new Error("Function not implemented.");
  },
  update: function <RecordType extends RaRecord = any>(
    resource: string,
    params: UpdateParams<any>
  ): Promise<UpdateResult<RecordType>> {
    throw new Error("Function not implemented.");
  },
  updateMany: function <RecordType extends RaRecord = any>(
    resource: string,
    params: UpdateManyParams<any>
  ): Promise<UpdateManyResult<RecordType>> {
    throw new Error("Function not implemented.");
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
    throw new Error("Function not implemented.");
  },
  deleteMany: function <RecordType extends RaRecord = any>(
    resource: string,
    params: DeleteManyParams<RecordType>
  ): Promise<DeleteManyResult<RecordType>> {
    throw new Error("Function not implemented.");
  },
};

export default dataProvider;
