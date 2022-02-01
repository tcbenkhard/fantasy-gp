import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {ApiError} from "./error";

export abstract class BaseHandler {
    abstract handle: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;

    public handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult | ApiError> => {
        try {
            console.log('Handler invoked with the following event:', event);
            const result = await this.handle(event);
            console.log('Result of handler:', result);
            return result;
        } catch (e) {
            if(e instanceof ApiError) {
                console.log('API error:', e);
                return e;
            } else {
                console.error(e);
                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        statusCode: 500,
                        error: 'An unexpected error occured.'
                    })
                }
            }
        }
    }
}