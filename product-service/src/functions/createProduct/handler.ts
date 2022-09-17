import { APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { v4 } from "uuid";
import { productService } from "../../serviсes";
import { inputSchema, outputSchema } from "@models/schema";
import validator from "@middy/validator";

const createProduct: ValidatedEventAPIGatewayProxyEvent<
  typeof inputSchema
  > = async (event): Promise<APIGatewayProxyResult> => {
  const uuid: string = v4();
  const { title, description, image, price, count } = event.body;

  console.log(
    `POST request: {
        title: ${title}, 
        description: ${description}, 
        image: ${image},
        price: ${price},
        count: ${count}
      }`,
  );

  try {
    const newProduct = await productService.createProduct({
      productId: uuid,
      title,
      description,
      price,
      image,
      creationDate: Date.now(),
      count,
    });
    console.log('[db.put] newProduct', newProduct);

    return formatJSONResponse(200, newProduct);
  } catch (e) {
    console.error('Error during database request executing', e);
    return formatJSONResponse(500, e);
  }
};

export const main = middyfy(createProduct).use(
  validator({ inputSchema, outputSchema })
);
