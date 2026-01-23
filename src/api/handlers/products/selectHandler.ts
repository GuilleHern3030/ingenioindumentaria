import request from '../../controllers/products/selectController.js'
import handleError from '../errorHandler.js'

import product from '@/api/models/Product.js'
import attribute from '@/api/models/Attribute.js'
import category from '@/api/models/Category.js'

interface Response {
    product?: product,
    attributes: readonly attribute[],
    categories: readonly category[],
}

export const select = async(id:number|number[]|null):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        // Dar formato correcto al ID
        const productId = id ?? 0

        // Obtener el producto en formato JSON
        const response:Response = await request(productId)

        // Convertir a objeto Producto
        //const product = new Product(json)

        const { product, attributes, categories } = response

        // Devuelve el producto en formato correcto
        resolve({
            product: Object.freeze(product),
            attributes: Object.freeze(attributes),
            categories: Object.freeze(categories),
        })


    } catch(err:any) { reject(handleError(err)) }
})

export default select