import request from '@/api/controllers/categories/getCategoriesController'
import category from '@/api/models/Category'
import handleError from '../errorHandler'

/**
 * Obtiene un árbol con todas las categorías existentes
 * @returns {Record<string, any>} json con todas las categorías
 */
export const getHandler = async(includeDisabled=true):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        // Obtener los artículos en formato JSON
        const categoriesTree:category[] = await request(includeDisabled)

        //const categories = new Categories(categoriesTree)

        // Devuelve las categorías en formato correcto
        resolve(categoriesTree)


    } catch(err:any) { reject(handleError(err)) }
})

export default getHandler