import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { S3Event } from 'aws-lambda';
import fileParserService from "@services/index";

const importFileParser = async (event: S3Event) => {
  console.log('Received event: ', JSON.stringify(event.Records));

  let productList = [];

  try {
    await Promise.all(
      event.Records.map(async (record) => {
        const bucket = record.s3.bucket.name;
        console.log('Bucket: ', bucket);

        const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
        const fileName = record.s3.object.key.split('/')[1];
        console.log('FileName: ', fileName);

        productList = await fileParserService.getData(bucket, key);
        await fileParserService.moveFile(bucket, key);
        console.log('File parsing was successful!');
      })
    );
    return formatJSONResponse(200, productList);
  } catch (error) {
    console.error("File parsing failed with an error: ", error);
    return formatJSONResponse(500, error);
  }
}

export const main = middyfy(importFileParser);
