export class ApiError {
    private statusCode: number;
    private body: string;

    constructor(statusCode: number, errorCode: string, error: string) {
        this.statusCode = statusCode;
        this.body = JSON.stringify({
            statusCode: statusCode,
            errorCode,
            error
        })
    }

    static badRequest = (errorCode: string, error: string) => new ApiError(400, errorCode, error);

    static notFound = (errorCode: string, error: string) => new ApiError(404, errorCode, error);
}