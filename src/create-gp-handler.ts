import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {BaseHandler} from "./util/base-handler";
import {z} from 'zod';
import {validate} from "./util/zod";
import {GrandPrixService} from "./service/gp-service";
import {Response} from "./util/response";
import {ApiError} from "./util/error";

const CreateGPRequestSchema = z.object({
    playerName: z.string(),
    gpName: z.string(),
    email: z.string().email(),
    password: z.string()
});

export type CreateGPRequest = z.infer<typeof CreateGPRequestSchema>;

class CreateGPHandler extends BaseHandler {
    private gpService = new GrandPrixService();

    handle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        if(!event.body) throw ApiError.badRequest('MISSING_REQUEST_BODY', 'Missing request body.')
        const request = validate(JSON.parse(event.body), CreateGPRequestSchema);
        const gp = await this.gpService.createGP(request);

        return Response.created(gp);
    };
}

export const handler = new CreateGPHandler().handler;