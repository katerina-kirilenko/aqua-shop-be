import csv from 'csv-parser';
import * as AWS from 'aws-sdk';
import IProduct from '@models/product';

AWS.config.update({ region: 'eu-central-1' });

export default class FileParserService {
  constructor(
    private readonly s3: AWS.S3,
    private readonly sqs: AWS.SQS
  ) {}

  async getData(bucket: string, key: string): Promise<IProduct[]> {
    const data = [];

    const s3Stream = this.s3
      .getObject({
        Bucket: bucket,
        Key: key,
      })
      .createReadStream();

    return new Promise<IProduct[]>((resolve, reject) => {
      console.log('S3-stream started.');

      s3Stream
        .pipe(csv())
        .on("data", async (newData) => {
          console.log("Parsed data: ", newData);
          await this.sendMessages(newData);
          return [...data, newData];
        })
        .on("error", (error) => {
          console.log('Parsing failed: ', error);
          reject("Parsing failed.");
        })
        .on("end", () => {
          console.log('The file was parsed.');
          resolve(data);
        });
    });
  }

  async moveFile(bucket: string, key: string) {
    console.log("Moving file started from ", key);

    await this.s3
      .copyObject({
        Bucket: bucket,
        CopySource: `${bucket}/${key}`,
        Key: key.replace('uploaded', 'parsed'),
      })
      .promise();

    console.log(`File copied to folder 'parsed'`);

    await this.s3
      .deleteObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();

    console.log(`File deleted from folder 'uploaded'`);
  }

  private async sendMessages(product: string) {
    const params = {
      MessageBody: JSON.stringify(product),
      QueueUrl: 'https://sqs.eu-central-1.amazonaws.com/083525352146/catalogItemsQueue'
    };

    this.sqs.sendMessage(params, function(error, data) {
      if (error) {
        console.log(`Sending failed: ${error}`);
      } else {
        console.log(`Sent message ${JSON.stringify({ messageId: data.MessageId, product })}`);
      }
    });
    // await this.sqs.sendMessage({
    //   QueueUrl: '${self:provider.environment.SQS_URL}',
    //   MessageBody: JSON.stringify(product),
    // }).promise();
  }
}
