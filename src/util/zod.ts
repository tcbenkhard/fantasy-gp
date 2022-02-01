import {ZodSchema} from "zod";
import {ApiError} from "./error";

export const validate = (object: any, schema: ZodSchema<any>) => {
    try {
        return schema.parse(object);
    } catch (e) {
        console.error(e);
        throw ApiError.badRequest('Request body does not match the schema');
    }
}