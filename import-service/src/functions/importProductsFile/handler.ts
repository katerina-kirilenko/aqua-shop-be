import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { v4 as uuid } from "uuid";
import * as AWS from "aws-sdk";

const s3 = new AWS.S3({ region: 'eu-central-1' });

const importProductsFile = async (event) => {
  console.log('Start lambda importProductsFile');
  try {
    const id = uuid();
    const file = `${event.queryStringParameters.name}`;
    const fileName = `${file.split('.')[0]}-${id}`;
    console.log('File: ', fileName);

    const signedUrl = s3.getSignedUrl('putObject', {
      Bucket: 'aquashop-import-service',
      Key: `uploaded/${fileName}.csv`,
      Expires: 60,
      ContentType: 'text/csv',
    });

    console.log('SignedUrl: ', signedUrl);

    return formatJSONResponse(200, signedUrl);
  } catch (error) {
    console.log(`Error:  ${error}`);

    return formatJSONResponse(500, {
      message: error.message || 'Failed to upload file'
    });
  }
};

export const main = middyfy(importProductsFile);
