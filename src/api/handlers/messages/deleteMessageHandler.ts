import request from '../../controllers/messages/deleteMessageController'
import handleError from '../errorHandler'
import { isAdmin } from '../../index'

/**
 * Delete a message from DataBase
 * @returns Promise with JSON object
 */
export const deleteMessage = async(id:number):Promise<any> => new Promise(async(resolve, reject) => {

    if (isAdmin() === true) try {

        if (id != undefined && !isNaN(id) && id >= 0) {

            const result = await request(id)
            resolve(result)

        } else reject("El mensaje no existe")

    } catch(err:any) { reject(handleError(err)) }
        else reject(handleError("La sesión caducó. Vuelve a iniciar sesión para continuar."))
})

export default deleteMessage