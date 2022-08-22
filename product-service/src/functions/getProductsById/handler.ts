import { formatJSONResponse } from '@libs/api-gateway';

import { getProductById } from "@functions/products";

const getProduct = async (event) => {
    console.log('event:', event);
    let productId = event.pathParameters.productId;

    if (!event.pathParameters || !productId) {
        return {
            statusCode: 400,
            message: 'Missing the Product ID from the path'
        }
    }

    if (getProductById(productId)) {
        return formatJSONResponse(getProductById(productId));
    }


    return {
        statusCode: 400,
        message: 'Product not found'
    };
};

export const main = getProduct;
