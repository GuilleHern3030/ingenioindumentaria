import request from '../../controllers/products/selectController.js'
import handleError from '../errorHandler.js'
import { Product } from '../../objects/Product.js'

export const select = async(id:number, includeDisabled?:boolean):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        // Obtener el producto en formato JSON
        const json:Record<string, any> = await request(id, includeDisabled === true)

        // Convertir a objeto Producto
        const product = new Product(json)

        // Devuelve el producto en formato correcto
        resolve(product)


    } catch(err:any) { reject(handleError(err)) }
})

export default select