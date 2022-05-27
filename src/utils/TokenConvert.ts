// To parse this data:
//
//   import { Convert, Token } from "./file";
//
//   const token = Convert.toToken(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

import Token from "../Token";
import { WooCredentials } from "../types";

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class TokenConvert {
  public static toToken(json: string): Token {
    return cast(JSON.parse(json), reference("Token"));
  }

  public static tokenToJson(value: Token): string {
    return JSON.stringify(uncast(value, reference("Token")), null, 2);
  }

  public static toWooCredentials(json: string): WooCredentials {
    return cast(JSON.parse(json), reference("WooCredentials"));
  }

  public static wooCredentialsToJson(value: WooCredentials): string {
    return JSON.stringify(uncast(value, reference("WooCredentials")), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any = ""): never {
  if (key) {
    throw Error(
      `Invalid value for key "${key}". Expected type ${JSON.stringify(
        typ
      )} but got ${JSON.stringify(val)}`
    );
  }
  throw Error(
    `Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`
  );
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ""): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue("array", val);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue("Date", val);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any
  ): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue("object", val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, prop.key);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === "object" && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers")
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty("props")
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function array(typ: any) {
  return { arrayItems: typ };
}

function union(...typs: any[]) {
  return { unionMembers: typs };
}

function object(props: any[], additional: any) {
  return { props, additional };
}


function reference(name: string) {
  return { ref: name };
}

const typeMap: any = {
  Token: object(
    [
      { json: "access_token", js: "accessToken", typ: union(undefined, "") },
      { json: "refresh_token", js: "refreshToken", typ: union(undefined, "") },
      { json: "scope", js: "scope", typ: union(undefined, "") },
      { json: "expires_in", js: "expiresIn", typ: union(undefined, 0) },
      { json: "token_type", js: "tokenType", typ: union(null, "") },

      // extends Partial<FortnoxToken>
      { json: "id", js: "id", typ: union(undefined, "") },
      { json: "user_id", js: "userId", typ: union(undefined, "") },
      { json: "expires_at", js: "expiresAt", typ: union(undefined, "") },
      // { json: "access_token", js: "accessToken", typ: u(undefined,"") },
      // { json: "refresh_token", js: "refreshToken", typ: u(undefined,"") },
      // { json: "scope", js: "scope", typ: u(undefined,"") },
      // { json: "expires_in", js: "expiresIn", typ: u(undefined, 0) },
      // { json: "token_type", js: "tokenType", typ: u(undefined,"") },
    ],
    false
  ),
  WooCredentials: object(
    [
      { json: "consumer_key", js: "consumerKey", typ: union(undefined, "") },
      { json: "consumer_secret", js: "consumerSecret", typ: union(undefined, "") },
      { json: "storefront_url", js: "storefrontUrl", typ: union(undefined, "") },
      { json: "name", js: "name", typ: union(undefined, "") },

      // extends Partial<WooCommerceKeys>
      { json: "id", js: "id", typ: union(undefined, "") },
      { json: "user_id", js: "userId", typ: union(undefined, "") },
      { json: "created_at", js: "createdAt", typ: union(undefined, "") },
      { json: "updated_at", js: "updatedAt", typ: union(undefined, "") },
    ],
    false
  ),
};
