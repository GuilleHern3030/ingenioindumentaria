import { Attributes } from '@/api/objects/Attributes'
import { attribute } from '@/api/objects/Attribute'
import request from '../../controllers/attributes/selectByCategoryCascadeController'
import handleError from '../errorHandler'

export const selectByCategoryCascade = async(slug?:string, includeDisabled?:boolean):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        // Corrige el formato de la ruta
        const categorySlug = typeof(slug) === 'string' ? slug : ''

        // Obtener los atributos en formato JSON
        const jsonArray:attribute[] = await request(
            categorySlug.toLowerCase().trim().replace(/\s+/g, '-'),
            includeDisabled === true
        )

        // Devuelve las atributos en formato correcto
        resolve(Object.assign(new Attributes(), jsonArray))

    } catch(err:any) { reject(handleError(err)) }
})

export default selectByCategoryCascade