import FileParserService from "./fileParserService";
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3({ region: 'eu-central-1' });

const fileParserService = new FileParserService(s3);

export default fileParserService;
