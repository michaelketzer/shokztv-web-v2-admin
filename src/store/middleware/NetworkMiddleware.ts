import asmCrypto from 'asmcrypto-lite';
import {normalize} from 'normalizr';
import {MiddlewareAPI} from 'redux';
import NetworkError from './NetworkError';
import {
  CALL_API,
  CallAction,
  NETWORK_FAILURE,
  NETWORK_REQUEST,
  NETWORK_SUCCESS,
  NetworkType,
  ServerResponseAction,
  Action,
  Dispatch
} from './NetworkMiddlewareTypes';
import * as Network from './Network';

export const activeRequest = new Map();

export default function networkMiddleware<State extends object>(store: MiddlewareAPI<Dispatch, State>) {
  return function (next: Dispatch) {
    return function (action: Action | CallAction = {} as Action) {
      if (typeof action[CALL_API] === 'undefined') {
        return next(action);
      }

      return executeFetch<State>(action as CallAction, store, next);
    };
  };
}

function executeFetch<State extends object>(
  action: CallAction,
  store: MiddlewareAPI<Dispatch, State>,
  next: Dispatch,
): Promise<unknown> {
  const callAPI = action[CALL_API];
  const {endpoint, schema, types, headers = Network.getDefaultHeader(), options = {}, method = 'get'} = callAPI;
  if (typeof types !== 'object') {
    throw new Error('Types are not given');
  }
  const {requestType, successType, failureType} = types;
  const state = store.getState();
  const endPointUrl = typeof endpoint === 'function' ? endpoint(state) : endpoint;

  validateParameter(endPointUrl, requestType, successType, failureType);

  const hash = generateRequestHash({
    endPointUrl, headers, method, options, types,
  });

  if (activeRequest.has(hash) && method === 'get') {
    return activeRequest.get(hash);
  }

  const requestTime = Date.now();

  function actionWith(data: Action & { networkType: NetworkType }): ServerResponseAction {
    const finalAction = {
      hash,
      method,
      options,
      requestTime,
      endpoint: endPointUrl,
      ...action,
      ...data,
    };
    delete finalAction[CALL_API];
    return finalAction;
  }

  next(actionWith({networkType: NETWORK_REQUEST, type: requestType}));
  const request = Network[method](endPointUrl, options, headers).then((response) => {
    activeRequest.delete(hash);
    const normalizedResponse = schema ? normalize(response, schema) : response;
    next(actionWith({networkType: NETWORK_SUCCESS, response: normalizedResponse, type: successType}));
    return normalizedResponse;
  }, (error) => handleErrorResponse(error, next, actionWith, failureType, callAPI.throwNetworkError));
  activeRequest.set(hash, request);
  return request;
}

async function handleErrorResponse(
  error: Response | Error,
  next: Dispatch,
  actionWith: (data: Action & { networkType: NetworkType }) => ServerResponseAction,
  failureType: string | string[],
  throwNetworkError?: boolean,
): Promise<NetworkError> {
  if (error instanceof Error) {
    //Network error, timeout etc.:
    next(actionWith({
      error,
      networkType: NETWORK_FAILURE,
      response: error.stack,
      type: failureType,
    }));
    throw error;
  }
  //Server error - response code >= 400:
  const respType = error.headers.get('Content-Type')!;
  const isJson = respType.indexOf('application/json') !== -1 || respType.indexOf('application/javascript') !== -1;
  let responseText;
  try {
    responseText = isJson ? await error.json() : await error.text();
  } catch (e) {
    responseText = e;
  }
  next(actionWith({
    networkType: NETWORK_FAILURE,
    response: responseText,
    responseStatus: error.status,
    type: failureType,
  }));
  const networkError = new NetworkError(responseText, error);
  if (throwNetworkError) {
    throw networkError;
  } else {
    return networkError;
  }

}

function validateParameter(endpoint: unknown, requestType: unknown, successType: unknown, failureType: unknown): void {
  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }
  if (
    typeof requestType !== 'string' ||
    !(typeof successType === 'string' || Array.isArray(successType)) ||
    typeof failureType !== 'string'
  ) {
    throw new Error('Expected action types to be strings.');
  }
}

function generateRequestHash(object: object): string {
  // The stringified object has to be encoded because asmCrypto cannot hash unicode values.
  return asmCrypto.SHA256.hex(encodeURI(JSON.stringify(object)));
}

export function handleResponseStatus(
  statuses: number[],
  callback: Function,
): (res: ServerResponseAction) => ServerResponseAction {
  return (res) => {
    if (res && statuses.includes(res.responseStatus)) {
      return callback(res.response);
    }
    return res;
  };
}
