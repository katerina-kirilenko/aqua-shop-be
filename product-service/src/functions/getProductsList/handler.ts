import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';

import schema from './schema';
import { getAllProducts } from "@functions/products";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
    return formatJSONResponse(getAllProducts());
};

export const main = getProductsList;
