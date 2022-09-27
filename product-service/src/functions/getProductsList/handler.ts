import { APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import validator from "@middy/validator";
import { middyfy } from "@libs/lambda";
import { outputSchema } from "@models/schema";
import { productService } from "../../serviсes";

export const getAllProducts = async (): Promise<APIGatewayProxyResult> => {
    try {
        const products = await productService.getAllProducts();
        console.log('[db.scan] products', products);

        return formatJSONResponse(200, products);
    } catch (e) {
        console.error('Error during database request executing', e);
        return formatJSONResponse(500, e);
    }
};

export const main = middyfy(getAllProducts).use(
  validator({ outputSchema })
);
