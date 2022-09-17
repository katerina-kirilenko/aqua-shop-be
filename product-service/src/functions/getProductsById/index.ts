import { handlerPath } from '@libs/handler-resolver';

export const getProduct = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        cors: true,
      },
    },
  ],
};
