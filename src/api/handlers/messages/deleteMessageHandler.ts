import request from '../../controllers/messages/deleteMessageController.ts'
import handleError from '../errorHandler.ts'
import { isAdminSignedIn } from '../../index.ts'

/**
 * Delete a message from DataBase
 * @returns Promise with JSON object
 */
export const deleteMessage = async(id:number):Promise<any> => new Promise(async(resolve, reject) => {

    if (isAdminSignedIn() === true) try {

        if (id != undefined && !isNaN(id) && id >= 0) {

            const result = await request(id)
            resolve(result)

        } else reject("El mensaje no existe")

    } catch(err:any) { reject(handleError(err)) }
    else reject("La sesión caducó. Vuelve a iniciar sesión para continuar.")
})

export default deleteMessage