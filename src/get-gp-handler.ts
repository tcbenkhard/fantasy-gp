import {BaseHandler} from "./util/base-handler";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {GrandPrixService} from "./service/gp-service";
import {Response} from "./util/response";

class GetGpHandler extends BaseHandler {
    private gpService = new GrandPrixService();

    handle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const gpId = event.pathParameters!.gpid!;
        const gp = await this.gpService.findGP(gpId);

        return Response.ok(gp);
    }
}

export const handler = new GetGpHandler().handler;