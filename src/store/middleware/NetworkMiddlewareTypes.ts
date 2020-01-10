import {Schema} from 'normalizr';
import { State } from '../Store';

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = 'Call API';

export const NETWORK_REQUEST = 'NETWORK_REQUEST';
export const NETWORK_SUCCESS = 'NETWORK_SUCCESS';
export const NETWORK_FAILURE = 'NETWORK_FAILURE';

export type NETWORK_METHOD = 'get' | 'post' | 'patch' | 'del' | 'put';

export interface UrlParams {
  [x: string]: string | number | string[] | number[] | boolean | null | undefined;
}

export interface RequestOptions {
  urlParams?: UrlParams;
  data?: object;
  ignoreNotFound?: boolean;
}

export interface CallAction {
  type?: never; //this is filled by the middleware
  [CALL_API]: {
    endpoint: string | ((state: object) => string);
    headers?: { [key: string]: string };
    method?: NETWORK_METHOD;
    schema?: Schema;
    options?: RequestOptions;
    throwNetworkError?: boolean;
    types: {
      requestType: string | string[];
      successType: string | string[];
      failureType: string | string[];
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

export interface ServerRequestAction {
  endpoint: string;
  hash: string;
  method: string;
  requestTime: number;
}

export type NetworkType = typeof NETWORK_REQUEST | typeof NETWORK_SUCCESS | typeof NETWORK_FAILURE;

export interface ServerResponseAction<Response extends object = {
  entities?: {
    [s: string]: {};
  };
  result?: {
    [s: string]: Array<string | number>;
  };
}, Options extends object = {
  urlParams?: UrlParams;
  data?: {};
}> {
  type: string | string[];
  endpoint: string;
  method: NETWORK_METHOD;
  hash: string;
  requestTime: number;
  options?: Options;
  response?: Response;
  networkType: NetworkType;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

export interface Action<T = string | string[]> {
    type: T;
    [CALL_API]?: never; //creates an XOR for Action/CallAction
    // tslint:disable-next-line:no-any
    [x:string]: any;
}
   

export interface ActionDispatcher<Result = Promise<void> | void, S extends {} = State> {
    (dispatch: Dispatch, getState: () => S): Result;
}

export type SomeAction = Action | CallAction | ActionDispatcher<any, any>;

export interface Dispatch<A extends SomeAction = SomeAction> {
    <T = (A extends CallAction ? Promise<void> : void)>(action: A): T;
}
   