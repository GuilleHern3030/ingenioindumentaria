import request from '../../controllers/messages/getMessagesController.ts'
import handleError from '../errorHandler.ts'
import { isAdmin } from '../../index.ts'

/**
 * Download messages from DataBase
 * @returns Promise with JSON
 */
export const getMessages = async():Promise<any> => new Promise(async(resolve, reject) => {

    if (isAdmin() === true) try {

        // Solicitar la petición al Backend
        const messages = await request()
        
        // Devuelve la respuesta del Backend
        console.log("Mensajes:", messages)
        resolve(messages)

    } catch(err:any) { reject(handleError(err)) }
    else reject(handleError("La sesión caducó. Vuelve a iniciar sesión para continuar."))
})

export default getMessages