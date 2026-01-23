import request from '../../controllers/products/selectByCategoryCascadeController'
import handleError from '../errorHandler'

export const selectByCategoryCascade = async(slug?:string, includeDisabled?:boolean):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        // Corrige el formato de la ruta
        const categorySlug = typeof(slug) === 'string' ? slug : ''

        // Obtener los productos en formato JSON
        const products:Array<any> = await request(
            categorySlug.toLowerCase().trim().replace(/\s+/g, '-'),
            includeDisabled === true
        )

        // Devuelve las categorías en formato correcto
        resolve(products)


    } catch(err:any) { reject(handleError(err)) }
})

export default selectByCategoryCascade