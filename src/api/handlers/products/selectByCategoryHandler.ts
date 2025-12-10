import request from '../../controllers/products/selectByCategoryController'
import handleError from '../errorHandler'
import { Product } from '../../objects/Product'

export const selectByCategory = async(slug?:string, includeDisabled?:boolean):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        // Corrige el formato de la ruta
        const categorySlug = typeof(slug) === 'string' ? slug : ''

        // Obtener los productos en formato JSON
        const jsonArray:Array<any> = await request(
            categorySlug.toLowerCase().trim().replace(/\s+/g, '-'),
            includeDisabled === true
        )

        // Parsear productos
        const products = jsonArray
            .map(json => new Product(json))// convertir a objeto Producto
            //.filter(product => onlyActives === true && product.isActive() === true || onlyActives !== true) // filtrar activos

        // Devuelve las categorías en formato correcto
        resolve(products)


    } catch(err:any) { reject(handleError(err)) }
})

export default selectByCategory