import request from '../../controllers/products/selectByCategoryController'
import handleError from '../errorHandler'

export const selectByCategory = async(slug?:string):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        // Corrige el formato de la ruta
        const categorySlug = typeof(slug) === 'string' ? slug : ''

        // Obtener los productos en formato JSON
        const jsonArray:Array<any> = await request(
            categorySlug.toLowerCase().trim().replace(/\s+/g, '-')
        )

        // Devuelve las categorías en formato correcto
        resolve(jsonArray)

    } catch(err:any) { reject(handleError(err)) }
})

export default selectByCategory