import csv from 'csv-parser';
import IProduct from '@models/product';

export default class FileParserService {
  constructor(private readonly s3) {}

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
        .on("data", (newData) => {
          console.log("Parsed data: ", newData);
          return [...data, newData];
        })
        .on("error", (error) => {
          console.log('Parsing failed: ', error);
          reject("Parsing failed.");
        })
        .on("end", () => {
          console.log('Parsing completed.');
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
}
