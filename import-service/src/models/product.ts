export default interface IProduct {
  productId: string,
  title: string,
  description?: string,
  price: number,
  image?:  string,
  creationDate: number,
  count: number,
}
