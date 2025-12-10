import request from '../../controllers/articles/selectController.js'
import handleError from '../errorHandler.js'
import { Product } from '../../objects/Product.js'

export default async(slug:string, include_children:boolean=false, filters:object=null, order:object=null, start:number=0, limit:number=20):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        // Obtener el producto en formato JSON
        const json:Record<string, any> = await request(slug, include_children, filters, order, start, limit)

        // Convertir a objeto Producto
        const product = new Product(json)

        // Devuelve el producto en formato correcto
        resolve(product)


    } catch(err:any) { reject(handleError(err)) }
})