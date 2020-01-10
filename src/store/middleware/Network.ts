import { RequestOptions } from "./NetworkMiddlewareTypes";


export function getDefaultHeader(): Headers {
    const jwt = localStorage.getItem('jwt');
    return new Headers({
        'Content-Type': 'application/json',
        ...(jwt ? {'Authorization': `JWT ${jwt}`} : {})
    });
}

export interface ApiResponse {
    code: number; 
    data?: any; 
    err?: string;
}

export interface ApiActionResponse<T = {}> {
    response: Omit<ApiResponse, 'data'> & {
        data: T;
    }
}

export async function get(endPointUrl: string, options: RequestOptions, headers: { [key: string]: string; } | Headers): Promise<ApiResponse | Response> {
    return fetch(endPointUrl, {method: 'GET', headers, ...options}).then(handleResponse);
}

export async function post(endPointUrl: string, options: RequestOptions, headers: { [key: string]: string; } | Headers): Promise<ApiResponse | Response> {
    return fetch(endPointUrl, {method: 'POST', headers, ...options}).then(handleResponse);
}

export async function patch(endPointUrl: string, options: RequestOptions, headers: { [key: string]: string; } | Headers): Promise<ApiResponse | Response> {
    return fetch(endPointUrl, {method: 'PATCH', headers, ...options}).then(handleResponse);
}

export async function del(endPointUrl: string, options: RequestOptions, headers: { [key: string]: string; } | Headers): Promise<ApiResponse | Response> {
    return fetch(endPointUrl, {method: 'DELETE', headers, ...options}).then(handleResponse);
}

export async function put(endPointUrl: string, options: RequestOptions, headers: { [key: string]: string; } | Headers): Promise<ApiResponse | Response> {
    return fetch(endPointUrl, {method: 'PUT', headers, ...options}).then(handleResponse);
}

async function handleResponse(response: Response): Promise<ApiResponse | Response> {
    if(response.ok) {
        const respType = response.headers.get('Content-Type')!;
        const isJson = respType.indexOf('application/json') !== -1 || respType.indexOf('application/javascript') !== -1;
        try {
            const data = isJson ? await response.json() : await response.text();
            return {data, code: response.status};
        } catch (err) {
            return {data:'asd', code: response.status, err};
        }
    }

    return response;
}