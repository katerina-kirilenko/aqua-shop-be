import { handlerPath } from '@libs/handler-resolver';

export const catalogBatchProcess = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: '${self:provider.environment.SQS_ARN}',
      },
    },
  ],
};
