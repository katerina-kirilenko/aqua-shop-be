import type { AWS } from '@serverless/typescript';
import { createProduct, getProduct, getAllProducts, catalogBatchProcess } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dynamodb-local'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-central-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      TABLE_REF: { Ref: 'Products' },
      SNS_REF: { Ref: 'SNSTopic' },
      SQS_ARN:
        "arn:aws:sqs:eu-central-1:083525352146:catalogItemsQueue",
      SNS_ARN:
        "arn:aws:sns:eu-central-1:083525352146:createProductTopic",
    },
    iam: {
      role: {
        statements: [{
          Effect: "Allow",
          Action: [
            "s3:*",
            "cloudwatch:*",
            "dynamodb:DescribeTable",
            "dynamodb:Query",
            "dynamodb:Scan",
            "dynamodb:GetItem",
            "dynamodb:PutItem",
            "dynamodb:UpdateItem",
            "dynamodb:DeleteItem",
          ],
          Resource: "arn:aws:dynamodb:eu-central-1:*:table/Products",
        },
        {
          Effect: "Allow",
          Action: ["sqs:*"],
          Resource: "${self:provider.environment.SQS_ARN}",
        },
        {
          Effect: "Allow",
          Action: ["sns:*"],
          Resource: "${self:provider.environment.SNS_ARN}",
        }],
      },
    },
  },
  resources: {
    Resources: {
      Products: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: 'Products',
          AttributeDefinitions: [{
            AttributeName: "productId",
            AttributeType: "S",
          }],
          KeySchema: [{
            AttributeName: "productId",
            KeyType: "HASH"
          }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
        }
      },
      SNSTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "createProductTopic",
        },
      },
      SNSSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "katerina.sanway@gmail.com",
          Protocol: "email",
          TopicArn: { Ref: "SNSTopic" },
        },
      },
    }
  },
  functions: { getAllProducts, getProduct, createProduct, catalogBatchProcess },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      start: {
        port: 5000,
        inMemory: true,
        migrate: true,
      },
      stages: "dev"
    }
  },
};

module.exports = serverlessConfiguration;
