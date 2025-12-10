import request from '../../controllers/attributes/selectAllController'
import handleError from '../errorHandler'

export const selectAll = async(includeDisabled?:boolean):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        // Obtener los atributos en formato JSON
        const attributes:Array<any> = await request(
            includeDisabled === true
        )

        // Devuelve los atributos en formato correcto
        resolve(attributes)


    } catch(err:any) { reject(handleError(err)) }
})

export default selectAll