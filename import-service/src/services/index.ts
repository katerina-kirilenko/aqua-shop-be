import { S3, SQS } from 'aws-sdk';
import FileParserService from './fileParserService';

const s3 = new S3({ region: 'eu-central-1' });
const sqs = new SQS({ region: 'eu-central-1' });

const fileParserService = new FileParserService(s3, sqs);

export default fileParserService;
