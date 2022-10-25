import type { AWS } from '@serverless/typescript';
import { importProductsFile, importFileParser } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-central-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      UPLOAD_BUCKET: 'aquashop-import-bucket',
      BUCKET_REF: { Ref: 'AquashopImportBucket' },
      SQS_REF: { Ref: 'catalogItemsQueue' },
      SQS_NAME: 'catalogItemsQueue',
      SQS_ARN:
        'arn:aws:sqs:eu-central-1:083525352146:catalogItemsQueue',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 's3:ListBucket',
            Resource: 'arn:aws:s3:::${self:provider.environment.UPLOAD_BUCKET}',
          },
          {
            Effect: 'Allow',
            Action: 's3:*',
            Resource: 'arn:aws:s3:::${self:provider.environment.UPLOAD_BUCKET}/*',
          },
          {
            Effect: 'Allow',
            Action: ['sqs:*'],
            Resource: '${self:provider.environment.SQS_ARN}',
          },
        ],
      },
    },
  },
  functions: { importProductsFile, importFileParser },
  resources: {
    Resources: {
      AquashopImportBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:provider.environment.UPLOAD_BUCKET}',
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedOrigins: ['*'],
                AllowedHeaders: ['*'],
                AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE'],
              },
            ],
          },
        }
      },
      AquashopImportBucketPolicy: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: '${self:provider.environment.UPLOAD_BUCKET}',
          PolicyDocument: {
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  AWS: '*',
                },
                Action: '*',
                Resource: [
                  'arn:aws:s3:::${self:provider.environment.UPLOAD_BUCKET}',
                  'arn:aws:s3:::${self:provider.environment.UPLOAD_BUCKET}/*'
                ],
              },
            ],
          },
        },
      },
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: "${self:provider.environment.SQS_NAME}",
        },
      },
      catalogItemsQueuePolicy: {
        Type : 'AWS::SQS::QueuePolicy',
        Properties: {
          Queues: [{ Ref: 'catalogItemsQueue' }],
          PolicyDocument: {
            Statement: [{
              Action: ['sqs:*'],
              Effect: 'Allow',
              Resource: '*',
            }]
          }
        }
      }
    },
  },
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
  }
};

module.exports = serverlessConfiguration;
