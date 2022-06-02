import { DataProvider } from "ra-core";
import { fortnoxDataProvider, wooCommerceDataProvider } from "../dataProvider";

class CompositeDataProvider {
  private readonly dataProviders: {
    dataProvider: DataProvider<string>;
    resources: string[];
  }[];
  constructor(
    dataProviders: Array<{
      dataProvider: DataProvider<string>;
      resources: string[];
    }>
  ) {
    this.dataProviders = dataProviders;
  }

  _delegate(name: string, resource: string, params?: any) {
    const result = this.dataProviders.find((dp) =>
      dp.resources.includes(resource)
    )!;

    if (!result)
      return Promise.reject({
        error: `Unknown data provider for '${name}' of ${resource}`,
      });

    return result.dataProvider[name](resource, params);
  }

  getList(resource: string, params?: any) {
    return this._delegate("getList", resource, params);
  }
  getOne(resource: string, params?: any) {
    return this._delegate("getOne", resource, params);
  }
  getMany(resource: string, params?: any) {
    return this._delegate("getMany", resource, params);
  }
  getManyReference(resource: string, params?: any) {
    return this._delegate("getManyReference", resource, params);
  }
  create(resource: string, params?: any) {
    return this._delegate("create", resource, params);
  }
  update(resource: string, params?: any) {
    return this._delegate("update", resource, params);
  }
  updateMany(resource: string, params?: any) {
    return this._delegate("updateMany", resource, params);
  }
  delete(resource: string, params?: any) {
    return this._delegate("delete", resource, params);
  }
  deleteMany(resource: string, params?: any) {
    return this._delegate("deleteMany", resource, params);
  }
}

export default CompositeDataProvider;
