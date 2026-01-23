import { attributevalue } from "./Attribute"
import image from "./Image"

export interface variant {
    id: number,
    price: number,
    stock: number|null,
    name?: string,
    description?: string,
    discount?: number,
    createdAt?: string,
    updatedAt?: string,
    disabled?: boolean,
    attributes?: attributevalue[],
    images?: image[]
}

export default variant