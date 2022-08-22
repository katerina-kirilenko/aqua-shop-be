// @ts-ignore
import products from "./products.json";

export interface IProduct {
    id: string,
    title: string,
    description: string,
    price: number,
    image: string,
}

export const getProductById = ( id: string ): IProduct => products.find( product => product.id === id );
export const getAllProducts = (): IProduct[] => products;
