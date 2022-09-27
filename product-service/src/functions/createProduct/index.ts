import { handlerPath } from "@libs/handler-resolver";

export const createProduct = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        cors: true,
      },
    },
  ],
};
