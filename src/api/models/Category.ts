/**
 * Categorías contiene atributos y se relacionan con los productos
 */

import attribute from "./Attribute"

export interface category {
    attributes:attribute[],
    children:category[],
    disabled:boolean,
    slug:string
}

export default category