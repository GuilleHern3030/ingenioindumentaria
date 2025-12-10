import request from '../../controllers/articles/getController'
import handleError from '../errorHandler.js'
import { Product } from '../../objects/Product.js'

export default async(id:number):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        // Obtener el producto en formato JSON
        const json:Record<string, any> = await request(id)

        // Convertir a objeto Producto
        const product = new Product(json)

        // Devuelve el producto en formato correcto
        resolve(product)


    } catch(err:any) { reject(handleError(err)) }
})