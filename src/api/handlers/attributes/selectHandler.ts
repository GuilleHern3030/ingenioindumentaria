import { Attribute, attribute } from '@/api/objects/Attribute.js'
import request from '../../controllers/attributes/selectController.js'
import handleError from '../errorHandler.js'

export const select = async(id:number):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        // Obtener el atributo en formato JSON
        const json:attribute = await request(id)

        // Devuelve el atributo en formato correcto
        resolve(new Attribute(json))


    } catch(err:any) { reject(handleError(err)) }
})

export default select