import request from '../../controllers/messages/deleteMessagesController.ts'
import handleError from '../errorHandler.ts'
import { isAdminSignedIn } from '../../index.ts'

/**
 * Delete all messages from DataBase
 * @returns Promise with JSON object
 */
export const deleteMessage = async():Promise<any> => new Promise(async(resolve, reject) => {

    if (isAdminSignedIn() === true) try {

        const result = await request()
        resolve(result)

    } catch(err:any) { reject(handleError(err)) }
    else reject("La sesión caducó. Vuelve a iniciar sesión para continuar.")
})

export default deleteMessage