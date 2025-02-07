/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as filesystem from "../filesystem.js";
import type * as groups from "../groups.js";
import type * as http from "../http.js";
import type * as lib_access from "../lib/access.js";
import type * as projects from "../projects.js";
import type * as queries from "../queries.js";
import type * as workspace from "../workspace.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  filesystem: typeof filesystem;
  groups: typeof groups;
  http: typeof http;
  "lib/access": typeof lib_access;
  projects: typeof projects;
  queries: typeof queries;
  workspace: typeof workspace;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
