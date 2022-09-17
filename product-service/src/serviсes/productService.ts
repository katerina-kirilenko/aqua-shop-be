import { DocumentClient } from "aws-sdk/clients/dynamodb";
import IProduct from "@models/product";

export default class ProductService {
  private tableName: string = "Products";

  constructor(private docClient: DocumentClient) {}

  async getAllProducts(): Promise<IProduct[]> {
    const productsList = await this.docClient.scan({
      TableName: this.tableName,
    }).promise();

    return productsList.Items as IProduct[];
  }

  async getProduct(productId: string): Promise<IProduct> {
    const product = await this.docClient.get({
      TableName: this.tableName,
      Key: { productId }
    }).promise();

    return product.Item as IProduct;
  }

  async createProduct(product: IProduct): Promise<IProduct> {
    await this.docClient.put({
      TableName: this.tableName,
      Item: product
    }).promise();

    return product;
  }
}
