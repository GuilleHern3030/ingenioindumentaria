import { Categories } from '@/api/objects/Categories'
import request from '../../controllers/categories/selectAllController'
import handleError from '../errorHandler'

/**
 * Obtiene todas las categorías
 * @returns {Categories} Objeto que gestiona las categorías
 */
export const selectAll = async(includeDisabled?:boolean):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        // Obtener las categorías en formato JSON
        const jsonArray:Array<any> = await request(
            includeDisabled === true
        )

        // Devuelve las categorías en formato correcto
        resolve(new Categories(jsonArray))


    } catch(err:any) { reject(handleError(err)) }
})

export default selectAll