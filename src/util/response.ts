export class Response {
    statusCode: number;
    body: string;

    constructor(statusCode: number, obj: object) {
        this.statusCode = statusCode;
        this.body = JSON.stringify(obj);
    }

    static created = (obj: object) => new Response(201, obj);
}