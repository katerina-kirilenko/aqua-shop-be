import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import validator from "@middy/validator";
import { middyfy } from "@libs/lambda";
import { outputSchema } from "@models/schema";
import { productService } from "../../serviсes";

const getProduct = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { productId } = event.pathParameters;
    console.log('productId:', productId);

    const product = await productService.getProduct(productId);
    console.log('[db.get] by id:', product);

    if (!product) {
      return formatJSONResponse(404, "ID does not exist")
    }

    return formatJSONResponse(200, product);
  } catch (e) {
    console.error('Error during database request executing', e);
    return formatJSONResponse(500, e);
  }
};

export const main = middyfy(getProduct).use(
  validator({ outputSchema })
);
