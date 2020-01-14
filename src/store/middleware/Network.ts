import { RequestOptions } from "./NetworkMiddlewareTypes";

export function getDefaultHeader(): object {
    const jwt = localStorage.getItem('jwt');
    return {
        'Content-Type': 'application/json',
        ...(jwt ? {'Authorization': `JWT ${jwt}`} : {})
    };
}

export interface ApiActionResponse<T = {}> {
    response: T;
}

export interface ApiActionEntitiesResponse<T = {}> {
    response: {
        entities: {
            [x: string]: T;
        }
    };
}

function injectUrlParams(endPointUrl: string, options: RequestOptions): string {
    let url = endPointUrl;
    if(options && options.urlParams && Object.keys(options.urlParams).length > 0) {
        Object.entries(options.urlParams).forEach(([key, value]) => {
            url = url.replace(`:${key}`, value as string);
        });
    }
    return url;
}

function getBody(data: object | FormData | undefined, headers: object): string | FormData | undefined {
    if(data) {
        const isJson = headers['Content-Type'] === 'application/json';

        if(isJson) {
            return JSON.stringify(data);
        }

        return data as FormData;
    }
}

export async function get(endPointUrl: string, options: RequestOptions, headers: { [key: string]: string; } | Headers): Promise<Response | object | string> {
    return fetch(injectUrlParams(endPointUrl, options), {method: 'GET', headers, ...options}).then(handleResponse);
}

export async function post(endPointUrl: string, options: RequestOptions, headers: { [key: string]: string; } | Headers): Promise<Response | object | string> {
    const body = getBody(options.data, headers);
    return fetch(injectUrlParams(endPointUrl, options), {method: 'POST', headers, ...options, body}).then(handleResponse);
}

export async function patch(endPointUrl: string, options: RequestOptions, headers: { [key: string]: string; } | Headers): Promise<Response | object | string> {
    const body = getBody(options.data, headers);
    return fetch(injectUrlParams(endPointUrl, options), {method: 'PATCH', headers, ...options, body}).then(handleResponse);
}

export async function del(endPointUrl: string, options: RequestOptions, headers: { [key: string]: string; } | Headers): Promise<Response | object | string> {
    return fetch(injectUrlParams(endPointUrl, options), {method: 'DELETE', headers, ...options}).then(handleResponse);
}

export async function put(endPointUrl: string, options: RequestOptions, headers: { [key: string]: string; } | Headers): Promise<Response | object | string> {
    const body = getBody(options.data, headers);
    return fetch(injectUrlParams(endPointUrl, options), {method: 'PUT', headers, ...options, body}).then(handleResponse);
}

async function handleResponse(response: Response): Promise<Response | object | string> {
    return new Promise((resolve, reject) => {
        if(response.ok) {
            const respType = response.headers.get('Content-Type')!;
            const isJson = respType.indexOf('application/json') !== -1 || respType.indexOf('application/javascript') !== -1;
            try {
                if(isJson) {
                    response.json().then((data) => resolve(data));
                } else {
                    response.text().then((data) => resolve(data));
                }
            } catch (err) {
                reject(response);
            }
        } else {
            reject(response);
        }
    });
}