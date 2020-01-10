export default class NetworkError {
    responseText: string;
    response: Response;
    responseStatus: number;

    constructor(responseText: string, response: Response) {
        this.responseText = responseText;
        this.response = response;
        this.responseStatus = response.status;
    }
}
