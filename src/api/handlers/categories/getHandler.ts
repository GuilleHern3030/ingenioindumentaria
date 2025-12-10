import request from '../../controllers/categories/getCategoriesController'
import { Categories } from '../../objects/Categories'
import { category } from '@/api/objects/Category'
import handleError from '../errorHandler'

/**
 * Obtiene un árbol con todas las categorías existentes
 * @returns {Record<string, any>} json con todas las categorías
 */
export const getHandler = async(includeDisabled=true):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        // Obtener los artículos en formato JSON
        const categoriesTree:category[] = await request(includeDisabled)

        const categories = new Categories(categoriesTree)

        // Devuelve las categorías en formato correcto
        resolve(categories)


    } catch(err:any) { reject(handleError(err)) }
})

export default getHandler