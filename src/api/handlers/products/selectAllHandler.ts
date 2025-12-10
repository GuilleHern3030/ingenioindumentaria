import request from '../../controllers/products/selectAllController'
import handleError from '../errorHandler'
import { Product } from '../../objects/Product'

export const selectAll = async(includeDisabled?:boolean):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        // Obtener los productos en formato JSON
        const jsonArray:Array<any> = await request(includeDisabled === true)

        // Convertir a objeto Producto
        const products = jsonArray.map(json => new Product(json))

        // Devuelve los productos en formato correcto
        resolve(products)


    } catch(err:any) { reject(handleError(err)) }
})

export default selectAll