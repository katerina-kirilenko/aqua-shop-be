import { handlerPath } from '@libs/handler-resolver';

export const importFileParser =  {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: 'aquashop-import-service',
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: 'uploaded/'
          },
        ],
        existing: true
      },
    },
  ],
};
