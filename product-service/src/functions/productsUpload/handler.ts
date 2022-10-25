import { middyfy } from '@libs/lambda';
import * as AWS from 'aws-sdk';
import { SQSEvent } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
import { productService } from '../../serviсes';
import { IProductCSV } from '@models/product';

const sns = new AWS.SNS({ region: 'eu-central-1' });

const catalogBatchProcess = async (event: SQSEvent) => {
  console.log('SQSEvent:', event);

  try {
    for (const record of event.Records) {
      const product: IProductCSV = JSON.parse(record.body);
      console.log('Product:::', product);

      const { title, description, image, price, count } = product;
      await productService.createProduct({
        productId: uuid(),
        title,
        description,
        price: +price,
        image,
        creationDate: Date.now(),
        count: +count,
      })
      console.log('Adding new product!');
    }

    sns.publish(
      {
        Subject: 'Adding products to the database',
        Message: 'New products have been added',
        TopicArn: 'arn:aws:sns:eu-central-1:083525352146:createProductTopic',
      },
      () => {
        console.log('The email has been sent');
      }
    );
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

export const main = middyfy(catalogBatchProcess);
