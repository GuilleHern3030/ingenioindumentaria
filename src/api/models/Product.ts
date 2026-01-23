import attribute from "./Attribute"
import category from "./Category"
import variant from "./Variant"

export interface product {
    id: number,
    name: string,
    description: string,
    inStock?: number,
    isRecent?: boolean,
    disabled?: boolean,
    price?: number,
    discount?: number,
    createdAt?: string,
    updatedAt?: string,
    slug?: string,

    // Joins
    variants?:variant[],
    images?:any[],
    categories?:category[],
    attributes?:attribute[]

}

export default product